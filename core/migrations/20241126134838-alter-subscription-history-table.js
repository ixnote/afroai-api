"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "subscription_history", // table name
      "updated_at", // new field name
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("subscription_history", "updated_at");
  },
};
