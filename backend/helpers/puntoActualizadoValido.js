const puntoActualizadoValido = (marcador1, marcador2) => {
    const secuenciaPuntos = [0, 15, 30, 40, 60];  // Posibles valores normales

    if (!secuenciaPuntos.includes(marcador1) && marcador1 !== -1) {
        return false;
    }
    if (!secuenciaPuntos.includes(marcador2) && marcador2 !== -1) {
        return false;
    }

    if ((marcador1 === -1 && marcador2 !== 40) || (marcador2 === -1 && marcador1 !== 40)) {
        return false;
    }


    return true;
}

module.exports = {puntoActualizadoValido}
