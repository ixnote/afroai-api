"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "users", // table name
      "token", // new field name
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "token");
  },
};
