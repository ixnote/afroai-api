const dotenv = require("dotenv");
dotenv.config();

// const secret = process.env.SECRET
const secret = process.env.JWT_SECRET;
module.exports = {
  secret,
};
