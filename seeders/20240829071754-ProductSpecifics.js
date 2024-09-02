'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed data for the ProductSpecific table
    await queryInterface.bulkInsert('ProductSpecifics', [
      {
        name: 'Color',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Size',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // Add more entries as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all data from the ProductSpecific table
    await queryInterface.bulkDelete('ProductSpecifics', null, {});
  }
};
