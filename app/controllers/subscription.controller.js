const Validator = require("../validators/validators.index");
const SubStore = require("../../app/stores/subscription.store");
const TransactionStore = require("../../app/stores/transaction.store");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const getPlans = asyncHandler(async (req, res, next) => {
  await SubStore.getPlans(req, res, next);
});

const makePayment = asyncHandler(async (req, res, next) => {
  const { error } = await Validator.makeSubscriptionPayment.validateAsync(
    req.body
  ); //validate request
  if (error) {
    next(new ErrorResponse(error.message, 400));
  } else {
    await SubStore.makePayment(req, res, next);
  }
});

const getSubscriptions = asyncHandler(async (req, res, next) => {
  await SubStore.getSubscriptions(req, res, next);
});

const confirm = asyncHandler(async (req, res, next) => {
  await TransactionStore.confirm(req, res, next);
});

const webhook = asyncHandler(async (req, res, next) => {
  await TransactionStore.webhook(req, res, next);
});

module.exports = {
  getPlans,
  getSubscriptions,
  makePayment,
  webhook,
  confirm,
};
