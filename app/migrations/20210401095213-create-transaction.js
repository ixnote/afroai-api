'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trx_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      tx_ref: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      flw_ref: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      device_fingerprint: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      charged_amount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      app_fee: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      merchant_fee: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      processor_response: {
        type: Sequelize.STRING,
        allowNull: true
      },
      auth_model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      narration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "initiated"
      },
      auth_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      plan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fraud_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      charge_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      account_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      card: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};