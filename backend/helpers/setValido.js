const setValido = (marcador1, marcador2) => {
    if ((marcador1 === 6 && marcador2 <= 4) || (marcador2 === 6 && marcador1 <= 4)) {
        return true;
    }

    if ((marcador1 === 7 && (marcador2 === 5 || marcador2 === 6)) || 
        (marcador2 === 7 && (marcador1 === 5 || marcador1 === 6))) {
        return true;
    }

    return false;
}

module.exports = { setValido }