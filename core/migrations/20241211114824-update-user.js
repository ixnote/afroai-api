"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "users", // table name
      "name", // new field name
      {
        type: Sequelize.STRING,
      }
    );
    await queryInterface.addColumn(
      "users", // table name
      "avatar", // new field name
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "name");
    await queryInterface.removeColumn("users", "avatar");
  },
};
