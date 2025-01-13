const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");
const asyncHandler = require("./async.js");
const ErrorResponse = require("../utils/errorResponse.js");
const db = require("../models/index.js");

const verifyToken = asyncHandler(async (req, res, next) => {
  //Get token from headers
  let token = req.headers["x-access-token"];
  console.log("🚀 ~ verifyToken ~ token:", token);

  if (!token) {
    return next(new ErrorResponse("No token provided", 401));
  }

  //verify and decode token
  jwt.verify(
    token,
    config.secret,
    asyncHandler(async (err, decoded) => {
      console.log("🚀 ~ asyncHandler ~ decoded:", decoded);
      if (err || !decoded.password) {
        return next(new ErrorResponse("Unauthorized access", 401));
      }
      //store decoded token in request

      user = await db.Users.findOne({
        where: { id: decoded.user_id },
      });
      req.user = user;
      next();
    })
  );
});
const authorize = (...roles) => {
  return (req, res, next) => {
    //console.log(req.user)
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Your current role is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

const authJwt = {
  verifyToken,
  authorize,
};
module.exports = authJwt;
