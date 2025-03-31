const setGanado = (marcador1, marcador2) => {
    if (marcador1 >= 6 || marcador2 >= 6) {
        if (Math.abs(marcador1 - marcador2) >= 2) {
            return true;
        }
        if (marcador1 === 7 || marcador2 === 7) {
            return true;
        }
    }
    return false;
}

module.exports = { setGanado }