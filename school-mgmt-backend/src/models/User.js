const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'teacher', 'student'), allowNull: false },
  classSection: { type: DataTypes.STRING }, // e.g., '10-A'
}, {
  tableName: 'users', // Matches the SQL above
  underscored: true,   // Matches created_at style
});

module.exports = User;