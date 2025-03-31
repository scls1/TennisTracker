const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');

const login = async(req, res = response) => {
    try {
        const { Email, Clave } = req.body;
        const usuarioBD = await Usuario.findOne({where: {Email:Email} });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(Clave, usuarioBD.Clave);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        const token = await generarJWT(usuarioBD.IdUsuario);
        res.json({
            ok: true,
            msg: 'login',
            token,
            usuario: usuarioBD.IdUsuario,

        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}


module.exports = { login }