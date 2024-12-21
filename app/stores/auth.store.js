const db = require("../models");
const config = require("../../config/auth.config");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../utils/errorResponse");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../services/mailers/nodemailer");
const moment = require("moment");
const asyncHandler = require("../middleware/async");
const otpGenerator = require("otp-generator");
const RegistrationMail = require("../services/mailers/templates/registration-mail");
const ForgotPasswordMail = require("../services/mailers/templates/forgot-password");
const sendSMS = require("../services/africas-talking");
const { notificationTypes } = require("../utils/helpers");
const dotenv = require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleAuth = asyncHandler(async (req, res, next) => {
  const { id_token } = req.body;
  console.log("🚀 ~ googleAuth ~ id_token:", id_token);

  if (!id_token) {
    return res.status(400).json({ message: "id_token is required" });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("🚀 ~ googleAuth ~ payload:", payload);

    const { email, name, picture } = payload;

    // Check if the user already exists in the database
    let user = await db.Users.findOne({
      where: { email },
      raw: true,
    });

    if (!user) {
      // If user does not exist, create a new one
      user = await db.Users.create(
        {
          email,
          name: name,
          password: id_token, // Save the id_token as the password without hashing
          avatar: picture,
          isConfirmed: true, // Set confirmed status (adjust based on your logic)
        },
        { raw: true }
      );
    } else {
      await db.Users.update(
        {
          name: name,
          avatar: picture,
        },
        {
          where: {
            id: user?.id,
          },
        }
      );
    }

    // Generate a JWT token
    const jwtToken = (userId) => {
      const payload = {
        user_id: userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 30,
      }; // Expires in 30 minutes
      return jwt.sign(payload, JWT_SECRET);
    };

    // Create a JWT
    // const jwtToken = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //     password: id_token,
    //     // username: user.username,
    //     // picture: user.profile_picture,
    //   },
    //   config.secret,
    //   { expiresIn: "1h" }
    // );

    delete user.password;
    const tokenUsage = await db.TokenUsage.findOne({
      where: { user_id: user.id },
    });

    // Return the JWT
    // res.json({
    //   success: true,
    //   message: "Google authentication successful",
    //   jwt: jwtToken,
    //   user: user,
    // });

    return res.status(200).send({
      success: true,
      data: {
        jwt: jwtToken,
        user: {
          ...user,
          availableToken: tokenUsage ? tokenUsage.remaining_tokens : 0,
        },
        // user: user,
        // token: tokenUsage ? tokenUsage.remaining_tokens : 0,
      },
      message: "Google authentication successful",
    });
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  googleAuth,
};
