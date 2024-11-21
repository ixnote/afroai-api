const Joi = require("@hapi/joi");
const db = require("../models");
const Op = db.Sequelize.Op;

const createUser = Joi.object({
  firstname: Joi.string().alphanum().min(3).required(),
  lastname: Joi.string().alphanum().min(3).required(),
  email: Joi.string().min(3).email({ minDomainSegments: 2 }).required(),
  role: Joi.string().alphanum(),
  phone: Joi.string().min(11).max(11).required(),
  username: Joi.string().trim().min(3).max(20).required(),
  password: Joi.string().trim().min(5).max(50).required(),
});

const forgotPassword = Joi.object({
  username: Joi.string()
    .pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)
    .trim()
    .required(),
});

const register = Joi.object({
  firstname: Joi.string().min(3).required(),
  lastname: Joi.string().min(3).required(),
  email: Joi.string().min(3).email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().min(11).max(11).required(),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]*$/)
    .trim()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string().trim().min(5).max(50).required(),
  dob: Joi.date().required(),
  gender: Joi.string().required().valid("M", "F"),
});

const resetPassword = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().trim().min(5).max(50).required(),
});

const googleAuth = Joi.object({
  id_token: Joi.string().required(),
});

module.exports = {
  createUser,
  forgotPassword,
  register,
  resetPassword,
  googleAuth,
};
