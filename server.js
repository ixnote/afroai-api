const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const colors = require("colors");
const jwt = require("jsonwebtoken");
const config = require("./config/auth.config");
const ErrorResponse = require("./app/utils/errorResponse");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
// const { updateNews } = require("./app/helpers/ads");
const cron = require("node-cron");

const app = express();
global.sendError = createError;
global.__basedir = __dirname + "/";

// Log requests to the console.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

app.use(hpp());

//Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 10000, // 1 minute
  max: 10000, // limit each IP to 100 requests per windowMs
  message: {
    statusCode: 429,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

const db = require("./app/models");
const errorHandler = require("./app/middleware/error");
//db.sequelize.sync({force:true})

//routes
require("./app/routes/index.routes")(app);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to AfroAi api." });
});

app.use(function (req, res, next) {
  next(sendError(404, "Route unavailable"));
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`AfroAI Server is running on port ${PORT}.`.cyan.underline);
});

// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`.cyan.underline);
// });
//module.exports = app;
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`.red);
  //Close server & exit process
  // server.close(() => process.exit(0));
  process.exit(0);
});
