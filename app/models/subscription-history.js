"use strict";
const { STRING } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubscriptionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}

    static get defaultScope() {}
  }
  SubscriptionHistory.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      tokens_allocated: {
        type: DataTypes.INTEGER,
      },
      payment_reference: {
        type: DataTypes.INTEGER,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
      },
      plan_name: {
        type: STRING,
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
      modelName: "SubscriptionHistory",
      tableName: "subscription_history",
    }
  );
  return SubscriptionHistory;
};
