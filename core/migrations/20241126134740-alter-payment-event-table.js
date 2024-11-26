"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "payment_events", // table name
      "updated_at", // new field name
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("payment_events", "updated_at");
  },
};
