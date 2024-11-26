"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "users", // table name
      "created_at", // new field name
      {
        type: Sequelize.DATE,
      }
    );
    await queryInterface.addColumn(
      "users", // table name
      "updated_at", // new field name
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "created_at");
    await queryInterface.removeColumn("users", "updated_at");
  },
};
