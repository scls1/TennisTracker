const { DataTypes } = require('sequelize');
const sequelize = require('../database/configbd'); 
const Set = require('./set');

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idSet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Set,
      key: 'Id'
    }
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marcador1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marcador2: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'games',
  timestamps: false
});

Game.belongsTo(Set, { foreignKey: 'idSet' });  // Relación con Game

module.exports = Game;
