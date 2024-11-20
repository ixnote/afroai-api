const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const verify = require("../middleware/verify");
const { authorize } = require("../middleware/authJwt");

router
  .post("/login", authCtrl.login)
  .post(
    "/register",
    [
      verify.checkDuplicateEmail,
      verify.checkDuplicatePhone,
      verify.checkDuplicateUsername,
    ],
    authCtrl.register
  );

module.exports = router;
