
const gameTerminado = (nuevoPunto, esTiebreak) => {
    const marcador1 = nuevoPunto.marcador1;
    const marcador2 = nuevoPunto.marcador2;

    
    if (esTiebreak) {
        if ((marcador1 >= 7 && marcador1 - marcador2 >= 2) || 
            (marcador2 >= 7 && marcador2 - marcador1 >= 2)) {
            return true;
        }
        return false; // Si no cumple las reglas del tiebreak, no es válido
    }

    if(marcador1 === 60 || marcador2 === 60){
        return true;
    }

    return false;
}

module.exports = { gameTerminado };