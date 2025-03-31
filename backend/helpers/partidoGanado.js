const partidoGanado = (sets, nMaxSets) => {
    const setsNecesariosParaGanar = Math.ceil(nMaxSets / 2);
    
    // Contadores para los sets ganados por cada jugador
    let setsJugador1 = 0;
    let setsJugador2 = 0;

    // Recorremos los sets y contamos los sets ganados por cada jugador
    for (let set of sets) {
        if (set.marcador1 > set.marcador2) {
            setsJugador1++;
        } else if (set.marcador2 > set.marcador1) {
            setsJugador2++;
        }

        // Si alguno de los jugadores alcanza el número necesario de sets para ganar, terminamos el partido
        if (setsJugador1 >= setsNecesariosParaGanar) {
            return true; // El jugador 1 ha ganado
        } else if (setsJugador2 >= setsNecesariosParaGanar) {
            return true; // El jugador 2 ha ganado
        }
    }

    // Si ninguno ha alcanzado el número necesario de sets, el partido sigue en curso
    return false;
}

module.exports = { partidoGanado}