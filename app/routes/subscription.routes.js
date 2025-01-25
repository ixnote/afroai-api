const express = require("express");
const router = express.Router();
const subCtrl = require("../controllers/subscription.controller");
const { authorize } = require("../middleware/authJwt");
const { multerUploads } = require("../middleware/multer");
const verify = require("../middleware/verify");
const authJwt = require("../middleware/authJwt");

router
  .get("/plans", subCtrl.getPlans)
  .get("/", [authJwt.verifyToken], subCtrl.getSubscriptions)
  .post("/confirm", subCtrl.confirm)
  .post("/webhook", subCtrl.webhook)
  // .get("/webhook", subCtrl.webhook)
  .post("/pay", [authJwt.verifyToken], subCtrl.makePayment);

module.exports = router;
