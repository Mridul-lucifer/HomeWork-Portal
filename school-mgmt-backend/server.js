const express = require('express');
const sequelize = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', apiRoutes);

// Root route for health check (helps debugging)
app.get('/', (req, res) => res.send('School Mgmt API is running'));

// 1. Connection logic that doesn't block the export
sequelize.authenticate()
  .then(() => console.log('✅ DB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// 2. Only call listen if NOT on Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  // Note: sequelize.sync({ alter: true }) is risky in prod; 
  // better to run it once locally or via a script.
  sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => console.log(`🚀 Local server on port ${PORT}`));
  });
}

// 3. CRITICAL: Export for Vercel
module.exports = app;
