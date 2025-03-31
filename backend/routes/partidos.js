const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getPartidos, getPartidosPorJugador, getPartidosPorEntrenador, createPartido, updatePartido, terminarPartido, deletePartido } = require('../controllers/partidos');
const router = Router();

router.get(['/','/:id'], validarJWT, getPartidos);
router.get('/jugador/:id', validarJWT, getPartidosPorJugador);
router.get('/entrenador/:id', validarJWT, getPartidosPorEntrenador);

router.post('/', [
    check('Jugador1', 'El argumento jugador1 es obligatorio').not().isEmpty(),
    check('Tipo', 'El argumento tipo es obligatorio').not().isEmpty(),
    check('NumSets', 'El argumento NumSets es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
],createPartido);

router.put('/:id', [
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updatePartido);

router.put('/terminar/:id', [
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], terminarPartido);

router.delete('/:id', validarJWT,deletePartido);

module.exports = router;