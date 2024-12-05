"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TokenUsage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}

    static get defaultScope() {}
  }
  TokenUsage.init(
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
      model_id: {
        type: DataTypes.INTEGER,
      },
      remaining_tokens: {
        type: DataTypes.INTEGER,
      },
      overflow_tokens: {
        type: DataTypes.INTEGER,
      },
      subscription_plan: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: Date,
      },
      updated_at: {
        type: Date,
      },
      total_tokens_used: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "TokenUsage",
      tableName: "token_usage",
    }
  );
  return TokenUsage;
};
