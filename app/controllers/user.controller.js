const Validator = require("../validators/validators.index");
const UserStore = require("../../app/stores/user.store");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const getUser = asyncHandler(async (req, res, next) => {
  await UserStore.getUser(req, res, next);
});

const getUsers = asyncHandler(async (req, res, next) => {
  await UserStore.getUsers(req, res, next);
});

const suspendUser = asyncHandler(async (req, res, next) => {
  await UserStore.suspendUser(req, res, next);
});

const reinstateUser = asyncHandler(async (req, res, next) => {
  await UserStore.reinstateUser(req, res, next);
});

module.exports = {
  getUser,
  getUsers,
  reinstateUser,
  suspendUser,
};
