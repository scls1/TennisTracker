const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getPuntos, createPunto, updatePunto, deletePunto, getPuntosPorGame, getPuntosPorSet, getPuntosPorPartido } = require('../controllers/puntos');
const router = Router();

router.get(['/','/:id'], validarJWT, getPuntos);
router.get('/game/:id', validarJWT, getPuntosPorGame);
router.get('/set/:id', validarJWT, getPuntosPorSet);
router.get('/partido/:id', validarJWT, getPuntosPorPartido);

router.post('/', [
    check('idGame', 'El argumento idGame es obligatorio').not().isEmpty(),
    check('marcador1', 'Formato de marcador1 invalido').not().isEmpty(),
    check('marcador2', 'El argumento marcador2 es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
],createPunto);

router.put('/:id', [
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updatePunto);

router.delete('/:id', validarJWT,deletePunto);

module.exports = router;