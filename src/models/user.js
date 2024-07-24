const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    sequelize,
    underscored: true,
    // Auto-Creating timestamp for each data of user
    timestamps: true,
    modelName: 'user',
    // Omitted accounts that had been disabled.
    /*defaultScope: {
      where: {
        disabled: false,
      },
    },
    // Refer to https://sequelize.org/master/manual/scopes.html.
    scopes: {
      admin: {
        where: {
          admin: true,
        },
      },
      disabled: {
        where: {
          disabled: true,
        },
      },
    },*/
  }
);

module.exports = User;
