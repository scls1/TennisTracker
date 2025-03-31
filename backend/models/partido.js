const { DataTypes } = require('sequelize');
const sequelize = require('../database/configbd');
const Jugador = require('./jugador'); 

const Partido = sequelize.define('Partido', {
  IdPartido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Jugador1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Jugador,
      key: 'IdJugador'
    }
  },
  Jugador2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Jugador,
      key: 'IdJugador'
    }
  },
  Jugador3: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Jugador,
      key: 'IdJugador'
    }
  },
  Jugador4: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Jugador,
      key: 'IdJugador'
    }
  },
  Pareja: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Rival1: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Rival2: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Tipo: {
    type: DataTypes.BOOLEAN,
    allowNull: false // 0 = Individual, 1 = Dobles
  },
  NumSets: {
    type: DataTypes.INTEGER,
    allowNull: false // valores posibles: 1, 3 o 5
  },
  FechaHoraEntrada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  FechaHoraSalida: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Partidos',
  timestamps: false
});

// Definir las relaciones
Partido.belongsTo(Jugador, { foreignKey: 'Jugador1', as: 'JugadorPrincipal' });
Partido.belongsTo(Jugador, { foreignKey: 'Jugador2', as: 'JugadorSecundario' });
Partido.belongsTo(Jugador, { foreignKey: 'Jugador3', as: 'JugadorTerciario' });
Partido.belongsTo(Jugador, { foreignKey: 'Jugador4', as: 'JugadorCuaternario' });

module.exports = Partido;
