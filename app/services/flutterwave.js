const dotenv = require("dotenv").config();
const axios = require("axios");
const asyncHandler = require("../middleware/async");

const baseUrl = "https://api.flutterwave.com/v3";

const options = {
  timeout: 1000 * 60,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
  },
};

const initiateTransaction = asyncHandler(async (payload) => {
  const response = await axios.post(`${baseUrl}/payments`, payload, options);
  // console.log(`Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`);
  return response.data.data.link;
});

const verifyTransaction = asyncHandler(async (id) => {
  const response = await axios.get(
    `${baseUrl}/transactions/${id}/verify`,
    options
  );
  console.log("verify ", response.data);
  return response.data;
});

const getBankList = asyncHandler(async (country = "NG") => {
  const response = await axios.get(`${baseUrl}/banks/${country}`, options);
  console.log("verify ", response.data);
  return response.data.data;
});

const verifyBank = asyncHandler(async (payload) => {
  const response = await axios.post(
    `${baseUrl}/accounts/resolve`,
    payload,
    options
  );
  return response.data.data;
});

const verifyBVN = asyncHandler(async (bvn) => {
  const response = await axios.get(`${baseUrl}/kyc/bvns/${bvn}`, options);
  console.log("verify ", response.data);
  return response.data;
});

const createTransfer = asyncHandler(async (payload) => {
  await axios.post(`${baseUrl}/transfers`, payload, options);
  return true;
});

module.exports = {
  initiateTransaction,
  verifyTransaction,
  getBankList,
  verifyBank,
  verifyBVN,
  createTransfer,
};
