const { DataTypes } = require('sequelize');
const sequelize = require('../database/configbd');
const Partido = require('./partido');
const Jugador = require('./jugador');
const EVENTOS = require('../enum/eventos.enum');  // Importamos el ENUM

const EventosPartido = sequelize.define('EventosPartido', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_partido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Partido,
            key: 'IdPartido'
        },
        onDelete: 'CASCADE'
    },
    Id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [Object.values(EVENTOS)] // Solo permite valores del ENUM
        }
    },
    Nombre_jugador: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Id_jugador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Jugador,
            key: 'IdJugador'
        },
        onDelete: 'CASCADE'
    },
    Fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Eventos_partido',
    timestamps: false
});


// Relación con Partido
Partido.hasMany(EventosPartido, { foreignKey: 'Id_partido' });
EventosPartido.belongsTo(Partido, { foreignKey: 'Id_partido' });

// Relación con Jugador
Jugador.hasMany(EventosPartido, { foreignKey: 'Id_jugador' });
EventosPartido.belongsTo(Jugador, { foreignKey: 'Id_jugador' });

module.exports = { EventosPartido, EVENTOS };
