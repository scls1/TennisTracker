const numeroSetsValido = (sets, nMaxSets) => {
    const setsNecesariosParaGanar = Math.ceil(nMaxSets / 2);
    let setsJugador1 = 0;
    let setsJugador2 = 0;

    // Contar los sets ganados por cada jugador
    for (const set of sets) {
        if (set.marcador1 > set.marcador2) {
            setsJugador1++;
        } else if (set.marcador2 > set.marcador1) {
            setsJugador2++;
        }
    }
    // Verificar si algún jugador ya ha ganado el número necesario de sets
    if (setsJugador1 > setsNecesariosParaGanar) {
        return false; // Si jugador 1 ha ganado suficientes sets, comprobar si jugador 2 no ha ganado suficientes
    }

    if (setsJugador2 > setsNecesariosParaGanar) {
        return false; // Si jugador 2 ha ganado suficientes sets, comprobar si jugador 1 no ha ganado suficientes
    }

    return true;

}

module.exports = {numeroSetsValido}