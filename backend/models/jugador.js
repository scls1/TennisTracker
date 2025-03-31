const { DataTypes } = require('sequelize');
const sequelize = require('../database/configbd'); 
const Usuario = require('./usuario'); 

const Jugador = sequelize.define('Jugador', {
  IdJugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Edad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Genero: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  Altura: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Foto: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Entrenador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,  // Hace referencia a la tabla Usuario
      key: 'IdUsuario'
    }
  }
}, {
  tableName: 'jugadores',
  timestamps: false
});

// Definir la relación entre Jugador y Usuario (Un usuario puede ser entrenador de varios jugadores)
Jugador.belongsTo(Usuario, { foreignKey: 'Entrenador' });
Usuario.hasMany(Jugador, { foreignKey: 'Entrenador' });

module.exports = Jugador;
