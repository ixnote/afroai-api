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

const login = asyncHandler(async (req, res, next) => {
  const { username, password, device_token } = req.body;

  const user = await db.User.findOne({
    where: {
      [Op.or]: [
        { username },
        { phone: `+234${username.slice(1)}` },
        { email: username },
      ],
    },
  });

  if (!user) {
    return res
      .status(404)
      .send({ success: false, message: "Invalid login credentials" });
  }
  if (!user.isConfirmed)
    return res
      .status(401)
      .send({ success: false, message: "You have not verified your account" });
  let passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res
      .status(401)
      .send({ success: false, message: "Invalid login credentials" });
  }

  if (user.deleted) {
    return res.status(401).send({
      success: false,
      message:
        "Your account has been suspended, please contact AfroAi admin for more details",
    });
  }

  if (user.suspended) {
    return next(
      new ErrorResponse(
        "Your account has been suspended, please contact AfroAi admin for more details",
        401
      )
    );
  }

  if (device_token) {
    user.device_token = device_token;
    await user.save();
    await FirebaseService.subscribeToTopic(device_token, "general", "ewallet");
  }

  if (!user.isPhoneVerified) {
    await resendOtp(req, res, next);
    // return next(new ErrorResponse("Phone is not verified", 503));
  }

  const sendUser = await db.User.findOne({
    where: { email: user.email },
    attributes: {
      exclude: ["password", "phoneVerificationOtp", "recipient_code"],
    },
  });

  // return user;
  let expire = 3600;
  let token = jwt.sign({ user }, config.secret, { expiresIn: expire });
  const getDate = new Date() + expire;
  const date = new Date(getDate);

  // Tokenization
  const findToken = await db.Token.findOne({
    where: {
      user: user.id,
    },
  });
  if (!findToken) {
    await db.Token.create({
      user: user.id,
      token,
      expiry: date,
    });
  } else {
    findToken.expiry = date;
    findToken.token = token;
    await findToken.save();
  }

  const fetchWallet = await retrieveWallet(user.email, user.role);
  const payload = {
    user: { ...sendUser.dataValues },
    token,
    expiresIn: expire,
  };
  let wallet = await createAccount(user);
  return res.status(200).send({
    success: true,
    message: "Login successful",
    data: payload,
    wallet: {
      account_number: wallet.account_number,
      account_name: wallet.account_name,
      status: wallet.account_type,
      balance: fetchWallet.balance,
    },
  });
});

module.exports = {
  login,
};
