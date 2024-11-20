const dotenv = require("dotenv");
dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST;
const node_env = process.env.NODE_ENV;
const dialect = "mysql";
const port = process.env.DB_PORT;

const config = {
  development: {
    username,
    password,
    database,
    host,
    dialect,
    port,
  },
  test: {
    username,
    password,
    database,
    host,
    dialect,
    port,
  },
  production: {
    username,
    password,
    database,
    host,
    dialect,
    port,
  },
};

module.exports = config[node_env];
