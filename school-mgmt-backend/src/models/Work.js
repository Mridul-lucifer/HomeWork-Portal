const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Work = sequelize.define('Work', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: { 
    // If ENUM continues to give "cast" errors, change this to DataTypes.STRING
    type: DataTypes.ENUM('homework', 'classwork'), 
    allowNull: false 
  },
  date: { 
    type: DataTypes.DATEONLY, 
    defaultValue: DataTypes.NOW 
  },
  classSection: { 
    type: DataTypes.STRING, 
    allowNull: false,
    field: 'class_section' // Matches the snake_case in Neon SQL
  },
  teacherId: { 
    type: DataTypes.UUID, 
    allowNull: false,
    field: 'teacher_id',
    references: {
      model: 'users', // Ensure your User model has tableName: 'users'
      key: 'id',
    }
  }
}, {
  tableName: 'works', // Lowercase plural is the standard convention for Sequelize
  underscored: true,   // Ensures createdAt becomes created_at in SQL
  timestamps: true,    
  freezeTableName: true, // This stops Sequelize from pluralizing the name
});

module.exports = Work;