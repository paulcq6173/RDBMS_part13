const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class TokenSession extends Model {}

TokenSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    token: {
      type: DataTypes.TEXT,
      default: 'none',
    },
    expired: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'token_sessions',
  }
);

module.exports = TokenSession;
