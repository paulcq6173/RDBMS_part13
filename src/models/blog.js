const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

// Declare a Blog Model for Sequelize
class Blog extends Model {}
Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.TEXT, allowNull: true },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: { args: [1991], msg: 'Must be greater than or equal to 1991' },
        max: { args: [2024], msg: 'Must be less than or equal to 2024' },
      },
      allowNull: false,
    },
    likes: { type: DataTypes.INTEGER, default: 0 },
  },
  { sequelize, underscored: true, timestamps: true, modelName: 'blog' }
);

module.exports = Blog;
