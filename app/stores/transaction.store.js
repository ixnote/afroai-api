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

const initiatePayment = asyncHandler(async (body) => {
  const { amount, currency, plan_id, user } = body;
  const ref = referenceGenerator();

  const payload = {
    tx_ref: ref,
    amount,
    currency,
    redirect_url: `${process.env.APP_URL}/api/v2/wallet/confirmation`,
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

  await db.PaymentEvent.create({
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

  await initiateTransaction(payload);

  return await initiateTransaction(payload);
});

const confirmation = asyncHandler(async (req, res, next) => {
  const { tx_ref, tx_id, transaction_id, txRef } = req.query;
  const trans_ref = tx_ref ?? txRef;
  const transaction = await db.PaymentEvent.findOne({
    where: { tx_ref: trans_ref, status: "initiated" },
  });

  if (!transaction) {
    return next(new ErrorResponse("Invalid or completed Transaction", 403));
  } else {
    const tx = tx_id ?? transaction_id;
    const verify = await verifyTransaction(tx);
    // console.log(verify)
    if (verify.status === "success") {
      if (
        verify.data.status === "successful" &&
        verify.data.amount >= transaction.amount
      ) {
        await transaction.update({
          status: verify.data.status,
          narration: verify.data.narration,
          payment_type: verify.data.payment_options,
          transaction_id: verify.data.id,
          flw_ref: verify.data.flw_ref,
        });

        const user = await db.User.findOne({
          where: { email: transaction.email },
        });

        let directory = JSON.stringify(__dirname);
        const directoryArray = directory.split("/");
        const newArray = directoryArray.splice(0, directoryArray.length - 1);
        directory = newArray.join("/");
        return res.sendFile(
          path.join(directory, "/templates/payment-success.html")
        );
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
    const payload = req.body.data;
    console.log(payload);
    req.query = { tx_ref: payload.tx_ref, tx_id: payload.id };
    await confirmation(req, res, next);
  } catch (e) {
    console.log(e.message);
    return res.status(401).end();
  }
});

module.exports = {
  initiatePayment,
  confirmation,
  webhook,
};
