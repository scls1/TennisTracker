const { Error } = require("sequelize");
const Game = require("../models/game");
const Set = require("../models/set");
const { gameValido } = require("./gameValido");
const { actualizarSet } = require("./ActualizarSet");

const crearNuevoGame =async (idSet, ganador) => {
    const set = await Set.findByPk(idSet);

    if (!set) throw new Error('Set no encontrado');

    const ultimoGame = await Game.findOne({
        where: { idSet },
        order: [['numero', 'DESC']]
    });

    let marcador1 = 0;
    let marcador2 = 0;
    let numero = 1;

    if (ultimoGame) {
        marcador1 = ultimoGame.marcador1;
        marcador2 = ultimoGame.marcador2;
        numero = ultimoGame.numero + 1;

        if (ganador === 1) marcador1 += 1;
        else if (ganador === 2) marcador2 += 1;
        else throw new Error('Valor de "ganador" inválido: debe ser 1 o 2');
    } else {
        // Si no hay games previos, solo se permite marcador 1 o 2 a 1.
        if (ganador === 1) marcador1 = 1;
        else if (ganador === 2) marcador2 = 1;
        else throw new Error('Valor de "ganador" inválido');
    }

    const nuevoGame = await Game.create({
        idSet,
        numero,
        marcador1,
        marcador2
    });

    actualizarSet(nuevoGame);

    return nuevoGame;
}

module.exports = {crearNuevoGame}