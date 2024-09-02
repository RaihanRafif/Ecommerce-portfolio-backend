'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductSpesificDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER
      },
      productSpesificId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      spesificDetailId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      stock:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      price:{
        type: Sequelize.FLOAT,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductSpesificDetails');
  }
};