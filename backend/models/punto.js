const { DataTypes } = require('sequelize');
const sequelize = require('../database/configbd'); 
const Game = require('./game');

const Punto = sequelize.define('Punto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idGame: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id'
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
  tableName: 'puntos',
  timestamps: false
});

Punto.belongsTo(Game, { foreignKey: 'idGame' });  // Relación con Game

module.exports = Punto;
