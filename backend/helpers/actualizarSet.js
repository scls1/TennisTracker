// ./ActualizarSet.js
const Set = require("../models/set");

const actualizarSet = async (game) => {
    try {
        const set = await Set.findByPk(game.idSet);

        if (!set) throw new Error('Set no encontrado al actualizar');

        await set.update({
            marcador1: game.marcador1,
            marcador2: game.marcador2
        });

        console.log(`Set ${set.id} actualizado correctamente`);
    } catch (err) {
        console.error("Error actualizando el set:", err);
        throw err;
    }
};

module.exports = { actualizarSet };
