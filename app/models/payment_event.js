"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}

    static get defaultScope() {}
  }
  PaymentEvent.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
      },
      tx_ref: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      flw_ref: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      currency: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      payment_status: {
        type: DataTypes.STRING,
      },
      customer_email: {
        type: DataTypes.STRING,
      },
      customer_name: {
        type: DataTypes.STRING,
      },
      plan_id: {
        type: DataTypes.INTEGER,
      },
      processed: {
        type: DataTypes.BOOLEAN,
      },
      verification_status: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: Date,
      },
      updated_at: {
        type: Date,
      },
    },
    {
      sequelize,
      modelName: "PaymentEvent",
    }
  );
  return PaymentEvent;
};
