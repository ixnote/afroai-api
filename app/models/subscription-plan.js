"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}

    static get defaultScope() {}
  }
  SubscriptionPlan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      plan_name: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      description: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: Date,
      },
      updated_at: {
        type: Date,
      },
      tokens_allocated: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "SubscriptionPlan",
    }
  );
  return SubscriptionPlan;
};
