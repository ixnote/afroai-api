const moment = require("moment");
const crypto = require("crypto");

const search = async (params, Op) => {
  const query = {};
  for (const property in params) {
    if (property.match(/Date/g)) {
      const limit = moment(`${parseInt(params[property]) + 1}`).format(
        "YYYY-MM-DD"
      );
      query[property] = {
        [Op.between]: [moment(params[property]).format("YYYY-MM-DD"), limit],
      };
    } else {
      query[property] = { [Op.like]: `%${params[property]}%` };
    }
  }
  return query;
};

const paginate = ({ page, pageSize }) => {
  const offset = (parseInt(page) - 1) * pageSize;
  const limit = parseInt(pageSize);

  return {
    offset,
    limit,
  };
};

const pageCount = ({ count, page, pageSize }) => {
  let pageTotal = Math.ceil(count / pageSize);
  let prevPage = null;
  let nextPage = null;

  if (page == pageTotal && page > 1) {
    prevPage = parseInt(page) - 1;
    nextPage = null;
  } else if (page > 1) {
    prevPage = parseInt(page) - 1;
    nextPage = parseInt(page) + 1;
  } else if (page == 1 && pageTotal > 1) {
    nextPage = 2;
  }

  return {
    prevPage,
    currentPage: parseInt(page),
    nextPage,
    pageTotal,
    pageSize: pageSize > count ? parseInt(count) : parseInt(pageSize),
  };
};

const referenceGenerator = () => {
  const time = moment().format("YYYY-MM-DD hh:mm:ss");
  const rand = Math.floor(Math.random(0, 9));

  return `AfroAi|${time.replace(/[\-]|[\s]|[\:]/g, "")}`;
};

const paystackReferenceGenerator = () => {
  const uuid = crypto.randomUUID();
  return uuid;
};

const transactionTypes = {
  WALLET: "WALLET",
  SUBSCRIPTION: "SUBSCRIPTION",
  PURCHASE: "PURCHASE",
  SETTLEMENT: "SETTLEMENT",
};

const transactionStatus = {
  STARTED: "STARTED",
  INPROGRESS: "IN-PROGRESS",
  COMPLETED: "COMPLETED",
};

const transactionGenus = {
  TRANSFER: "TRANSFER",
  WITHDRAWAL: "WITHDRAWAL",
  DEPOSIT: "DEPOSIT",
  PURCHASE: "PURCHASE",
  PURCHASE_REVERSAL: "PURCHASE_REVERSAL",
  REFERRAL: "REFERRAL",
  SAVINGS: "SAVINGS",
  AIRTIME: "AIRTIME",
  DATABUNDLE: "DATABUNDLE",
  BILLS: "BILLS",
  CABLE: "CABLE",
  ELECTRICITY: "ELECTRICITY",
  DISPATCH: "DISPATCH",
  SETTLEMENT: "SETTLEMENT",
  COMMISSION: "COMMISSION",
  DISPATCH_COMMISSION: "DISPATCH_COMMISSION",
};

const notificationType = {
  MEMBERSHIP: "MEMBERSHIP",
  PURCHASE: "PURCHASE",
  WITHDRAWAL: "WITHDRAWAL",
  CREDIT: "CREDIT",
};

const dispatchType = {
  REQUESTED: "REQUESTED",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
  CONFIRM: "CONFIRM",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  PAID: "PAID",
  PICKED_UP: "PICKED_UP",
  DELIVERED: "DELIVERED",
  TRANSIT: "TRANSIT",
  AWAITING_DISPATCH: "AWAITING_DISPATCH",
  INPROGRESS: "IN-PROGRESS",
};

const baxiErrors = [
  "BX0001",
  "BX0019",
  "BX0021",
  "BX0024",
  "EXC00103",
  "EXC00105",
  "EXC00109",
  "EXC00114",
  "EXC00124",
  "UNK0001",
];

const notificationTypes = {
  WALLET: "wallet",
  ORDER: "order",
  DISPATCH: "dispatch",
  DISPATCH_USER: "dispatch-user",
  DISPATCH_STORE: "dispatch-store",
  BROADCAST: "broadcast",
  UTILITIY: "utility",
  ALERT: "alert",
};
const helpers = {
  paginate,
  pageCount,
  referenceGenerator,
  paystackReferenceGenerator,
  transactionTypes,
  transactionGenus,
  transactionStatus,
  baxiErrors,
  notificationType,
  search,
  dispatchType,
  notificationTypes,
};

module.exports = helpers;
