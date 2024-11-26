const authJwt = require("../middleware/authJwt");
const { authorize } = require("../middleware/authJwt");
const AuthRoutes = require("./auth.routes");
const UserStore = require("./user.routes");
const SubStore = require("./subscription.routes");

module.exports = function (app) {
  app.use(function (req, res, next) {
    // console.log("🚀 ~ file: index.routes.js:30 ~ request:", req.body);
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use("/api/v1/auth", AuthRoutes);
  app.use("/api/v1/user", UserStore);
  app.use("/api/v1/subscriptions", SubStore);
};
