const gameActualizadoValido = (marcador1, marcador2) => {
    if (marcador1 < 0 || marcador1 > 7 || marcador2 < 0 || marcador2 > 7) {
        return false;
    }

    // Si un jugador llega a 7, el otro debe tener 5 o 6
    if ((marcador1 === 7 && (marcador2 < 5 || marcador2 > 6)) || 
        (marcador2 === 7 && (marcador1 < 5 || marcador1 > 6))) {
        return false;
    }

    // Si un jugador llega a 6, el otro debe tener al menos 4 (excepto cuando llega a 7)
    if ((marcador1 === 6 && marcador2 < 4) || (marcador2 === 6 && marcador1 < 4)) {
        return false;
    }

    return true;
}

module.exports = {gameActualizadoValido}