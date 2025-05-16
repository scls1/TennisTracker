const Usuario = require('../models/usuario');
const { response } = require('express');
const Jugador = require('../models/jugador');

const getJugadores = async(req, res) => {
    try {
        const id = req.params.id;
        if(id){
            const jugador = await Jugador.findByPk(id);
            if(!jugador){
                return res.json({
                    ok: false,
                    msg: 'player not found'
                });
            }
             return res.json({
                jugador,
                ok: true,
                msg: 'getJugadoresById'
            });
        }

        const jugadores = await Jugador.findAll();
        res.json({
            jugadores,
            ok: true,
            msg: 'getJugadores'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar jugador'
        });
    }
}

const getJugadoresPorEntrenador = async(req,res = response) => {
    try{
        const entrenador = req.params.id;
        const existeEntrenador = await Usuario.findByPk(entrenador);
        if(!existeEntrenador){
            return res.json({
                ok: false,
                msg: 'Coach not found'
            });
        }
        const jugadores = await Jugador.findAll({where: {Entrenador:entrenador}});
        if(jugadores.length === 0){
            return res.json({
                ok: false,
                msg: 'No players found for this coach'
            });
        }
        res.json({
            ok: true,
            msg: 'getJugadoresPorEntrenador',
            jugadores
        });
    }catch(err){
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar jugadores'
        });
    }

    

}

const createJugador = async(req,res) => {
    try {
        let {Nombre, Edad, Altura, Genero, Foto, Entrenador} = req.body;
        
        const existeEntrenador = await Usuario.findByPk(Entrenador);
        
        if(!existeEntrenador){
            return res.json({
                ok: false,
                msg:'El entrenador no existe'
            });
        }
        const jugador = await Jugador.create({
            Nombre,
            Edad: Edad || null,
            Altura: Altura || null,
            Genero: Genero || true,
            Foto: Foto || "default.jpg",
            Entrenador
        });

        res.json({
            ok: true,
            msg: 'Jugador creado correctamente',
            jugador
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear jugador'
        });
    }
}

const updateJugador = async (req, res) => {
    try {
        const id = req.params.id;
        const { Nombre, Edad, Altura, Genero, Foto } = req.body;
        
        // Buscar si el usuario existe
        const existeJugador = await Jugador.findByPk(id);
        if (!existeJugador) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el jugador'
            });
        }


        // Actualizar usuario
        await existeJugador.update({ 
            Nombre: Nombre || existeJugador.Nombre, 
            Edad: Edad || existeJugador.Edad,
            Altura: Altura || existeJugador.Altura,
            Genero: Genero || existeJugador.Genero,
            Foto: Foto || existeJugador.Foto,
            Entrenador: existeJugador.Entrenador
        });

        res.json({
            ok: true,
            msg: "Jugador actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando jugador'
        });
    }
}

const deleteJugador = async(req,res) => {
    try{
        const id = req.params.id;
        
        const jugadorExiste = await Jugador.findByPk(id);
        if(!jugadorExiste){
            return res.status(400).json({
                ok: false,
                msg: 'Este jugador no existe'
            });
        }

        await Jugador.destroy({where:{IdJugador: id}});
        
        res.json({
            ok: true,
            msg: 'jugador borrado con éxito',
            jugador: jugadorExiste
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar jugador'
        });
    }
}
    
   
module.exports = { getJugadores, getJugadoresPorEntrenador, createJugador, updateJugador, deleteJugador }