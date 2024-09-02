'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Define associations here if necessary
    }
  }
  Cart.init({
    specificProductId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalProduct: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Cart;
};
