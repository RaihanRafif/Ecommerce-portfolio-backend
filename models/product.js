'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    length: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    width: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    height: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    weight: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    size: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    material: {
      type: DataTypes.STRING,
    },
    style: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    categoryId: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};