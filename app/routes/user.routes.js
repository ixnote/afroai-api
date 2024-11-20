const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { authorize } = require("../middleware/authJwt");
const { multerUploads } = require("../middleware/multer");
const verify = require("../middleware/verify");
const authJwt = require("../middleware/authJwt");

router
  .get("/list", userCtrl.getUsers)
  .get("/:id", [authJwt.verifyToken], userCtrl.getUser)
  .put(
    "/suspend/:userId",
    [authJwt.verifyToken],
    [authorize("admin")],
    userCtrl.suspendUser
  );

module.exports = router;
