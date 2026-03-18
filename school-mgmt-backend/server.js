const express = require('express');
const sequelize = require('./src/config/db');
const apiRoutes = require('./src/routes/api'); // The routes we built earlier
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', apiRoutes);

// Test Neon Connection and Sync Models
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Neon PostgreSQL successfully.');
    
    // alter: true updates tables if you change the code models
    await sequelize.sync({ alter: true });
    console.log('✅ SQL Models synchronized.');

    const PORT = process.env.PORT;
    // At the end of server.js
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // This is CRITICAL for Vercel
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
