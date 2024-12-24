const db = require("../models");
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../utils/errorResponse");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../services/mailers/nodemailer");
const moment = require("moment");
const dotenv = require("dotenv").config();
const otpGenerator = require("otp-generator");
const asyncHandler = require("../middleware/async");
const { uploadImageSingle } = require("../services/cloudinary");
const { paginate, pageCount } = require("../utils/helpers");
const RegistrationMail = require("../services/mailers/templates/registration-mail");
const {
  verifyBank,
  getBankList,
  verifyBVN,
} = require("../services/flutterwave");
const { verify } = require("jsonwebtoken");
const sendSMS = require("../services/africas-talking");
const request = require("request");
const { createAccount } = require("./auth.store");

const createUser = asyncHandler(async (req, res, next) => {
  const {
    password,
    email,
    role,
    phone,
    firstname,
    lastname,
    username,
    gender,
  } = req.body;
  const data = { ...req.body };
  const pass = bcrypt.hashSync(password.trim(), 8);
  const otp = otpGenerator.generate(5, {
    digits: true,
    alphabets: false,
    specialChars: false,
    upperCase: false,
  });

  data.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
  data.lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
  data.password = pass;
  data.phone = "+234" + phone.slice(1);
  data.fullname = `${data.firstname} ${data.lastname}`;
  data.phoneVerificationOtp = otp;
  data.role = "user";
  data.username = username.trim();
  data.title = gender === "M" ? "Mr" : "Mrs";
  //const table = type.charAt(0).toUpperCase() + type.slice(1);
  // const roleCheck = await db.Role.findOne({ where: { name: role } });

  // if (!roleCheck) {
  //   return res.status(400).send({ success: false, message: "Invalid role" });
  // }

  const user = await db.Users.create(data);
  await db.Wallet.create({
    holder_id: user.id,
    email: user.email,
  });

  await getWallet(user.email, user.role);
  await createAccount(user);

  const message = `Hello ${data.firstname}, use this otp to verify your AfroAi   account: ${otp}`;
  const subject = `Welcome to AfroAi`;
  sendSMS(data.phone, message);
  sendMail(new RegistrationMail(user.email, subject, user, otp));
  await checkRegistrations();
  res.status(200).send({
    success: true,
    message:
      "An OTP has been sent to your registered mail, use it to verify your account",
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id ? req.params.id : req.user.id;
  const user = await db.Users.findOne({
    where: { id },
  });

  if (!user) {
    return next(new ErrorResponse("User with ID not found..", 404));
  }

  const tokenUsage = await db.TokenUsage.findOne({
    where: { user_id: user.id },
  });

  res.status(200).send({
    success: true,
    message: "User found",
    data: { user, token: tokenUsage ? tokenUsage.remaining_tokens : 0 },
  });
});

const getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, pageSize = 50, ...rest } = req.query;
  const query = {};
  for (const property in rest) {
    if (property.match(/Date/g)) {
      const limit = moment(`${parseInt(req.query[property]) + 1}`).format(
        "YYYY-MM-DD"
      );
      query[property] = {
        [Op.between]: [moment(req.query[property]).format("YYYY-MM-DD"), limit],
      };
    } else {
      query[property] = { [Op.like]: `%${req.query[property]}` };
    }
  }
  console.log("🚀 ~ getUsers ~ query:", query);
  // console.log(db);

  const users = await db.Users.findAndCountAll({
    where: query,
    ...paginate({ page, pageSize }),
    attributes: ["email", "password"],
  });

  // if (!users) {
  //   return next(new ErrorResponse("No users found", 404));
  // }

  res.status(200).send({
    success: true,
    message: "User list found",
    data: {
      total: users.count,
      pagination: {
        ...pageCount({ count: users.count, page, pageSize }),
      },
      users: users.rows,
    },
  });
});

const suspendUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await db.Users.findByPk(userId);
  if (!user) return next(new ErrorResponse("User was not found", 404));
  await user.update({
    suspended: true,
  });
  return res.status(200).json({
    success: true,
    message: "User has been suspended",
  });
});

const reinstateUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await db.Users.findByPk(userId);
  if (!user) return next(new ErrorResponse("User was not found", 404));
  await user.update({
    suspended: false,
  });
  return res.status(200).json({
    success: true,
    message: "User has been reinstated",
  });
});

module.exports = {
  createUser,
  getUser,
  getUsers,
  reinstateUser,
  suspendUser,
};
