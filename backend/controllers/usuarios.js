const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async(req, res) => {
    const id = req.params.id;
    try {
        if(id){
            const usuario = await Usuario.findByPk(id);
            if(!usuario){
                return res.json({
                    ok: false,
                    msg: 'usuario no encontrado'
                });
            }
             return res.json({
                usuario,
                ok: true,
                msg: 'getUsuariosById'
            });
        }

        const usuarios = await Usuario.findAll();
        res.json({
            usuarios,
            ok: true,
            msg: 'getUsuarios'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar usuario'
        });
    }
}

const createUsuario = async(req,res) => {
    try {
        let {Nombre,Email, Foto, Clave} = req.body;
        if(!Foto){
            Foto = "default.jpg";
        }
        let emailUsado = await Usuario.findOne({ where: { Email: Email }});
        if(emailUsado){
            return res.json({
                ok: false,
                msg: 'Error al crear usuario'
            })
        }
        
        const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
        password_encriptada = bcrypt.hashSync(Clave, salt); // y aquí ciframos la contraseña

        const usuario = await Usuario.create({
            Nombre,
            Email,
            Clave: password_encriptada, // Guardamos la contraseña encriptada
            Foto: Foto || "default.jpg"
        });

        res.json({
            ok: true,
            msg: 'Usuario creado correctamente',
            usuario
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear usuario'
        });
    }
}

const updateUsuario = async (req, res) => {
    try {
        const id = req.params.id || req.query.id;
        const { Nombre, Email, Clave, Foto } = req.body;
        
        // Buscar si el usuario existe
        const existeUsuario = await Usuario.findByPk(id);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        }
        

        const passValida = bcrypt.compareSync(Clave, existeUsuario.Clave);
        if(!passValida){
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar usuario PASS'
            });
        }


        // Actualizar usuario
        await existeUsuario.update({ 
            Nombre: Nombre || existeUsuario.Nombre, 
            Email: Email || existeUsuario.Email,
            Clave: existeUsuario.Clave,
            Foto: Foto || existeUsuario.Foto 
        });

        res.json({
            ok: true,
            msg: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }
}

const deleteUsuario = async(req,res) => {
    try{
        const id = req.params.id;
        
        const usuarioExiste = await Usuario.findByPk(id);
        if(!usuarioExiste){
            return res.status(400).json({
                ok: false,
                msg: 'Este usuario no existe'
            });
        }

        await Usuario.destroy({where:{IdUsuario: id}});
        
        res.json({
            ok: true,
            msg: 'usuario borrado con éxito',
            usuario: usuarioExiste
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar usuario'
        });
    }
}
    
   
module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario }