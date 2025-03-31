const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { createJugador, getJugadores, updateJugador, deleteJugador, getJugadoresPorEntrenador } = require('../controllers/jugadores');
const router = Router();

router.get(['/','/:id'], validarJWT, getJugadores);
router.get('/entrenador/:id', validarJWT, getJugadoresPorEntrenador);

router.post('/', [
    check('Nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('Entrenador', 'El id del entrenador es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
],createJugador);

router.put('/:id', [
    check('Nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updateJugador);

router.delete('/:id', validarJWT,deleteJugador);

module.exports = router;