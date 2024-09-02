'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert color values into the SpesificDetails table
    await queryInterface.bulkInsert('SpesificDetails', [
      {
        spesificId: 1, // Replace with the actual spesificId for color
        name: 'Red',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spesificId: 1, // Replace with the actual spesificId for color
        name: 'Blue',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spesificId: 1, // Replace with the actual spesificId for color
        name: 'Green',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Insert size values into the SpesificDetails table
      {
        spesificId: 2, // Replace with the actual spesificId for size
        name: 'S',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spesificId: 2, // Replace with the actual spesificId for size
        name: 'M',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spesificId: 2, // Replace with the actual spesificId for size
        name: 'L',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all data from the SpesificDetails table
    await queryInterface.bulkDelete('SpesificDetails', null, {});
  }
};
