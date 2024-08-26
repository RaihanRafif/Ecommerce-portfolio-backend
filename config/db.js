// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER,             // Database user
    process.env.DB_PASSWORD,             // Database password
    {
        host: process.env.DB_HOST, // Database host
        dialect: 'mysql',                         // Database dialect
        logging: false,                           // Disable logging (optional)
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
