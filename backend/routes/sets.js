const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getSets, createSet, updateSet, deleteSet, getSetsPorPartido} = require('../controllers/sets');
const router = Router();

router.get(['/','/:id'], validarJWT, getSets);
router.get('/partido/:id',validarJWT, getSetsPorPartido);

router.post('/', [
    check('idPartido', 'El argumento idPartido es obligatorio').not().isEmpty(),
    check('marcador1', 'Formato de marcador1 invalido').not().isEmpty(),
    check('marcador2', 'El argumento marcador2 es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
],createSet);

router.put('/:id', [
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updateSet);

router.delete('/:id', validarJWT,deleteSet);

module.exports = router;