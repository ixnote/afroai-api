const Validator = require("../validators/validators.index");
const UserStore = require("../../app/stores/user.store");
const AuthStore = require("../../app/stores/auth.store");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const googleAuth = asyncHandler(async (req, res, next) => {
  const { error } = await Validator.googleAuth.validateAsync(req.body); //validate request
  if (error) {
    next(new ErrorResponse(error.message, 400));
  } else {
    await AuthStore.googleAuth(req, res, next);
  }
});

const register = asyncHandler(async (req, res, next) => {
  const { error } = await Validator.register.validateAsync(req.body); //validate request
  if (error) {
    next(new ErrorResponse(error.message, 400));
  } else {
    await UserStore.createUser(req, res, next);
  }
});

module.exports = {
  register,
  googleAuth,
};
