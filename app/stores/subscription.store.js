const db = require("../models");
const Op = db.Sequelize.Op;
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { paginate, pageCount } = require("../utils/helpers");
const { initiatePayment, webhook } = require("./transaction.store");

const getPlans = asyncHandler(async (req, res, next) => {
  const plans = await db.SubscriptionPlans.findAll({
    attributes: { exclude: ["updatedAt"] },
  });
  if (!plans.length) {
    return next(new ErrorResponse("Unable to get plans", 404));
  }
  res.status(200).send({
    success: true,
    message: "Plans found",
    data: plans,
  });
});

const makePayment = asyncHandler(async (req, res, next) => {
  console.log("🚀 ~ makePayment ~ req:", req.user);
  const { plan_id } = req.body;
  const plan = await db.SubscriptionPlans.findOne({
    where: { id: plan_id },
    attributes: { exclude: ["updatedAt"] },
  });
  if (!plan) {
    return next(new ErrorResponse("Plan not found", 404));
  }
  const payload = {
    plan_id,
    amount: plan.amount,
    currency: "NGN",
    user: req.user,
    description: plan.description,
  };
  const response = await initiatePayment(payload);
  return res.status(200).send({
    success: true,
    data: {
      checkoutUrl: response,
    },
  });
});

const getSubscriptions = asyncHandler(async (req, res, next) => {
  const { page = 1, pageSize = 20, ...rest } = req.query;
  const query = {};
  console.log("🚀 ~ getUsers ~ query:", query);
  // console.log(db);

  const subscriptions = await db.SubcriptionHistory.findAndCountAll({
    where: query,
    ...paginate({ page, pageSize }),
    attributes: { exclude: ["updatedAt"] },
  });

  res.status(200).send({
    success: true,
    message: "Subscription list found",
    data: {
      total: subscriptions.count,
      pagination: {
        ...pageCount({ count: subscriptions.count, page, pageSize }),
      },
      subscriptions: subscriptions.rows,
    },
  });
});

const getWebhook = asyncHandler(async (req, res, next) => {
  return (response = await webhook(req, res, next));
  // console.log("🚀 ~ getWebhook ~ response:", response);
  // return res.status(200).send({
  //   success: true,
  // });
});

module.exports = {
  getPlans,
  getSubscriptions,
  makePayment,
  getWebhook,
};
