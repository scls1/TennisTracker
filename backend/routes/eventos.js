const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, getEventosDePartidoPorTipo, createEvento, updateEvento, deleteEvento } = require('../controllers/eventos');
const router = Router();

router.get(['/','/:id'], validarJWT, getEventos);
router.get('/:id/:tipo', [
    check('tipo', 'El argumento tipo es obligatorio'),
    check('id', 'El argumento id es obligatorio'),
    validarCampos,
    validarJWT
], getEventosDePartidoPorTipo);

router.post('/', [
    check('Id_partido', 'El argumento Id_partido es obligatorio').not().isEmpty(),
    check('Id_jugador', 'El argumento Id_jugador es obligatorio').not().isEmpty(),
    check('Id_evento', 'El argumento Id_evento es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT 
],createEvento);

router.put('/:id', [
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updateEvento);

router.delete('/:id', validarJWT,deleteEvento);

module.exports = router;