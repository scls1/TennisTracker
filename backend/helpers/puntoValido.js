const puntoValido = (puntos, nuevoPunto, esTiebreak) => {
    if (puntos.length === 0) {
        // Si es el primer punto del game, debe comenzar en (0-0)
        return nuevoPunto.marcador1 === 0 && nuevoPunto.marcador2 === 0;
    }

    const ultimoPunto = puntos[puntos.length - 1];
    const marcador1 = ultimoPunto.marcador1;
    const marcador2 = ultimoPunto.marcador2;

    if (esTiebreak) {
        if ((marcador1 >= 7 && marcador1 - marcador2 >= 2) || 
            (marcador2 >= 7 && marcador2 - marcador1 >= 2)) {
            return false; // El tiebreak ya terminó, no se pueden añadir más puntos
        }
        // En un tiebreak, los puntos avanzan en incrementos de 1
        if ((nuevoPunto.marcador1 === marcador1 + 1 && nuevoPunto.marcador2 === marcador2) || (nuevoPunto.marcador2 === marcador2 + 1 && nuevoPunto.marcador1 === marcador1)) {
            return true;
        }

        return false; // Si no cumple las reglas del tiebreak, no es válido
    }

    const secuenciaPuntos = [0, 15, 30, 40, 60]; // Secuencia de puntos normales
    const esVentaja = marcador1 === 40 && marcador2 === 40; // Se entra en ventaja
    const esVentaja2 = marcador1 === -1 || marcador2 === -1;

    if(marcador1 === 60 || marcador2 === 60){
        return false;
    }

    if (esVentaja) {
        // Si estamos en ventaja, el punto siguiente puede ser -1 (ventaja) o 60 (juego)
        if (nuevoPunto.marcador1 === 40 && nuevoPunto.marcador2 === -1) return true;
        if (nuevoPunto.marcador2 === 40 && nuevoPunto.marcador1 === -1) return true;
    } else if(esVentaja2) {
        if(marcador1 === -1){
            if(nuevoPunto.marcador1 === 60 && nuevoPunto.marcador2 === 40) return true;
            if(nuevoPunto.marcador1 === 40 && nuevoPunto.marcador2 === 40) return true;
        }   
        if(marcador2 === -1){
            if(nuevoPunto.marcador1 === 40 && nuevoPunto.marcador2 === 60) return true;
            if(nuevoPunto.marcador1 === 40 && nuevoPunto.marcador2 === 40) return true;
        } 
    }else {
        // Si no es ventaja, los puntos deben progresar en la secuencia correcta
        const indice1 = secuenciaPuntos.indexOf(marcador1);
        const indice2 = secuenciaPuntos.indexOf(marcador2);

        if (indice1 !== -1 && nuevoPunto.marcador1 === secuenciaPuntos[indice1 + 1] && nuevoPunto.marcador2 === marcador2) {
            return true;
        }

        if (indice2 !== -1 && nuevoPunto.marcador2 === secuenciaPuntos[indice2 + 1] && nuevoPunto.marcador1 === marcador1) {
            return true;
        }
    }

    return false; // Si no cumple ninguna regla, el punto no es válido
}

module.exports = { puntoValido }