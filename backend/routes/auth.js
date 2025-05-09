const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.post('/', [
    check('Clave', 'El argumento pasword es obligatorio').not().isEmpty(),
    check('Email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], login);



module.exports = router;