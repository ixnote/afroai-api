const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let message = { ...err };

  message.message = err.message;

  // Log to console for dev
  console.log(err);

  // validation error
  if (err.name === "ValidationError") {
    // const message = Object.values(err.errors).map(val => val.message);
    message = new ErrorResponse(err.message, 400);
  }

  // validation error
  if (err.name === "ReferenceError") {
    const value = err.message;
    message = new ErrorResponse(value, 400);
  }

  res.status(message.statusCode || 500).json({
    success: false,
    message: message.message || "Server Error",
  });
};

module.exports = errorHandler;
