const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect using the URL provided by Neon
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Neon's serverless connection
    },
  },
  logging: false, // Keeps your console clean
});

module.exports = sequelize;
