const { DataTypes } = require('sequelize');
const sequelize = require('../database/configbd'); 
const Partido = require('./partido');

const Set = sequelize.define('Set', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPartido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Partido, // La tabla a la que se refiere
      key: 'IdPartido'  // La clave primaria de la tabla Partidos
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
  tableName: 'sets',
  timestamps: false
});

Set.belongsTo(Partido, { foreignKey: 'idPartido' });  // Relación con Game

module.exports = Set;
