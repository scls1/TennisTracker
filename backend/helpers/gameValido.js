const { setGanado } = require("./setGanado");

const gameValido = (games, nuevoGame) => {
    if (games.length === 0) {
        return nuevoGame.marcador1 === 0 && nuevoGame.marcador2 === 0;
    }
    
    const ultimoGame = games[games.length - 1];
    console.log('ultimo game: ', ultimoGame);

    const diferencia1 = nuevoGame.marcador1 - ultimoGame.marcador1;
    const diferencia2 = nuevoGame.marcador2 - ultimoGame.marcador2;

    // Solo puede aumentar en 1 punto un solo jugador a la vez
    if ((diferencia1 === 1 && diferencia2 === 0) || (diferencia2 === 1 && diferencia1 === 0)) {
        return !setGanado(ultimoGame.marcador1, ultimoGame.marcador2);
    }

    return false;
}

module.exports = { gameValido };