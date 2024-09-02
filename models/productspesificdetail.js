'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSpesificDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductSpesificDetail.init({
    productId: DataTypes.INTEGER,
    productSpesificId: DataTypes.INTEGER,
    spesificDetailId: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ProductSpesificDetail',
  });
  return ProductSpesificDetail;
};