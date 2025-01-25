const db = require("../models");
const Op = db.Sequelize.Op;
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { initiateTransaction } = require("../services/flutterwave.js");
const { verifyTransaction } = require("../services/flutterwave.js");
const path = require("path");
// const SuccessMail = require("../templates/payment-success.html");
const _ = require("lodash");
const {
  transactionGenus,
  notificationTypes,
  referenceGenerator,
} = require("../utils/helpers");
const { where } = require("sequelize");

const initiatePayment = asyncHandler(async (body) => {
  const { amount, currency, plan_id, user } = body;
  const ref = referenceGenerator();

  const payload = {
    tx_ref: ref,
    amount,
    currency,
    // redirect_url: `${process.env.APP_URL}/api/v2/wallet/confirmation`,
    redirect_url: `${process.env.APP_URL}/plans/`,
    payment_options: "card",
    meta: {
      consumer_id: user.id,
    },
    customer: {
      email: user.email,
    },
    customizations: {
      title: "AfroAI Payments",
      description: body.description,
      logo: "#",
    },
  };

  await db.PaymentEvents.create({
    tx_ref: ref,
    email: user.email,
    customer_name: "",
    currency,
    amount,
    plan_id,
    processed: false,
    status: "pending",
    verification_status: "pending",
    payment_type: "card",
  });

  // await initiateTransaction(payload);

  return await initiateTransaction(payload);
});

const confirm = asyncHandler(async (req, res, next) => {
  const check = async () => {
    const { tx_ref, txRef } = req.query;
    const trans_ref = tx_ref ?? txRef;
    const transaction = await db.PaymentEvents.findOne({
      where: { tx_ref: trans_ref },
    });

    if (!transaction)
      return next(new ErrorResponse("Invalid or completed Transaction", 403));

    if (transaction.status == "pending" || transaction.status == "initiated")
      await check();
  };
  await check();
  return res.status(200).send({
    success: true,
    message: "Transaction successful",
  });
});

const confirmation = asyncHandler(async (req, res, next) => {
  const { tx_ref, tx_id, transaction_id, txRef } = req.query;
  const trans_ref = tx_ref ?? txRef;
  const transaction = await db.PaymentEvents.findOne({
    // where: { tx_ref: trans_ref, status: "initiated" },
    where: { tx_ref: trans_ref, status: "pending" },
  });

  if (!transaction) {
    return next(new ErrorResponse("Invalid or completed Transaction", 403));
  } else {
    const tx = tx_id ?? transaction_id;
    const verify = await verifyTransaction(tx);
    // console.log("🚀 ~ confirmation ~ verify:", verify.data);
    if (verify.status === "success") {
      if (
        verify.data.status === "successful" &&
        verify.data.amount >= transaction.amount
      ) {
        await transaction.update({
          status: verify.data.status,
          verification_status: verify.data.status,
          // narration: verify.data.narration,
          payment_type: verify.data.payment_type,
          transaction_id: verify.data.id,
          flw_ref: verify.data.flw_ref,
          customer_email: verify?.data?.customer?.email,
          customer_name: verify?.data?.customer?.name,
        });

        const subscriptionPlan = await db.SubscriptionPlans.findOne({
          where: { id: transaction?.plan_id },
          attributes: { exclude: ["updatedAt"] },
        });

        if (!subscriptionPlan) {
          return next(new ErrorResponse("Subscripion plan not found. ", 403));
        }

        const user = await db.Users.findOne({
          where: { email: verify.data?.customer?.email },
        });

        console.log("🚀 ~ confirmation ~ user:", user);

        if (!user) {
          return next(new ErrorResponse("User not found. ", 403));
        }

        console.log("🚀 ~ confirmation ~ subscriptionPlan:", subscriptionPlan);

        await db.SubscriptionHistory.create({
          user_id: user?.id,
          tokens_allocated: subscriptionPlan.tokens_allocated,
          payment_reference: verify.data.flw_ref,
          transaction_id: verify.data.id,
          plan_name: subscriptionPlan.plan_name,
        });

        let tokenUsage = await db.TokenUsage.findOne({
          where: { user_id: user?.id },
        });

        console.log("🚀 ~ confirmation ~ tokenUsage 1: ", tokenUsage);

        const overflowTokens = 20000;

        if (!tokenUsage) {
          tokenUsage = await db.TokenUsage.create({
            user_id: user?.id,
            model_id: 1,
            remaining_tokens: parseInt(
              subscriptionPlan.tokens_allocated - overflowTokens
            ),
            subscription_plan: subscriptionPlan.plan_name,
            overflow_tokens: overflowTokens,
          });
          console.log("🚀 ~ confirmation ~ tokenUsage NEW : ", tokenUsage);
        } else {
          tokenUsage.remaining_tokens += Number(
            subscriptionPlan.tokens_allocated - overflowTokens
          );
          tokenUsage.overflow_tokens =
            tokenUsage.overflow_tokens + parseInt(overflowTokens);

          await tokenUsage.save();
        }

        console.log("🚀 ~ confirmation ~ tokenUsage 2: ", tokenUsage);

        // return {
        //   tokenUsage,
        //   transaction,
        // };

        return res.status(200).send({
          success: true,
          // data: {
          //   tokenUsage,
          //   transaction,
          // },
          message: "Transaction successful",
        });

        // let directory = JSON.stringify(__dirname);
        // const directoryArray = directory.split("/");
        // const newArray = directoryArray.splice(0, directoryArray.length - 1);
        // directory = newArray.join("/");
        // return res.sendFile(
        //   path.join(directory, "/templates/payment-success.html")
        // );
      }
      return next(new ErrorResponse(verify.data.processor_response, 500));
    } else {
      transaction.status = "failed";
      await transaction.save();
      return next(new ErrorResponse(verify.message, 500));
    }
  }
});

const webhook = asyncHandler(async (req, res, next) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      // This request isn't from Flutterwave; discard
      res.status(401).end();
    }

    console.log("🚀 ~ webhook ~ payload:", req.body);
    const payload = req.body.data;
    req.query = {
      ...req.query,
      tx_ref: payload.tx_ref,
      tx_id: payload.transaction_id ?? payload.id,
    };
    await confirmation(req, res, next);
  } catch (e) {
    console.log("🚀 ~ webhook ~ e:", e);
    console.log(e.message);
    return res.status(401).end();
  }
});

module.exports = {
  confirm,
  initiatePayment,
  confirmation,
  webhook,
};
