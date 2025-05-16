const { Router } = require('express');
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuarios');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get(['/','/:id'], validarJWT, getUsuarios);

router.post('/', [
    check('Nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('Email', 'El argumento email es obligatorio').not().isEmpty(),
    check('Email', 'Formato de email invalido').isEmail(),
    check('Clave', 'El argumento clave es obligatorio').not().isEmpty(),
    validarCampos
],createUsuario);

router.put('/:id', [
    check('Nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('Email', 'El argumento email es obligatorio').not().isEmpty(),
    check('Email', 'Formato de email invalido').isEmail(),
    check('Clave', 'El argumento clave es obligatorio').not().isEmpty(),
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updateUsuario);

router.delete('/:id', validarJWT,deleteUsuario);

module.exports = router;