const { Op } = require('sequelize');
const Jugador = require('../models/jugador');
const Partido = require('../models/partido');
const Usuario = require('../models/usuario');

const getPartidos = async(req, res) => {
    try {
        const id = req.params.id;
        if(id){
            const partido = await Partido.findByPk(id);
            if(!partido){
                return res.json({
                    ok: false,
                    msg: 'partido no encontrado'
                });
            }
             return res.json({
                partido,
                ok: true,
                msg: 'getPartidosById'
            });
        }

        const partidos = await Partido.findAll();
        res.json({
            partidos,
            ok: true,
            msg: 'getPartidos'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar partido'
        });
    }
}

const getPartidosPorJugador = async(req,res) =>{
    try {
        const id = req.params.id;
        const jugadorExiste = await Jugador.findByPk(id);
        if(!jugadorExiste){
            return res.json({
                ok: false,
                msg: 'jugador no encontrado'
            });
        }

        const partidos = await Partido.findAll({ where: {
            [Op.or]: [
                { Jugador1: id },
                { Jugador2: id },
                { Jugador3: id },
                { Jugador4: id }
            ]
     }});

     res.json({
        ok: true,
        msg:'getPartidosPorJugador',
        partidos
     });

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar partidos'
        });
    }
}

const getPartidosPorEntrenador = async(req, res) => {
    try {
        const id = req.params.id;
        const entrenadorExiste = await Usuario.findByPk(id);
        if(!entrenadorExiste){
            return res.json({
                ok: false,
                msg: 'entrenador no encontrado'
            });
        }
        const jugadores = await Jugador.findAll({where:{Entrenador:id}})
        if(jugadores.length == 0){
            return res.json({
                ok: false,
                msg:'no hay jugadores creados'
            });
        }
        const idsJugadores = jugadores.map(j => j.IdJugador);
        const partidos = await Partido.findAll({where: {
            [Op.or]: [
                { Jugador1: { [Op.in]: idsJugadores } },
                { Jugador2: { [Op.in]: idsJugadores } },
                { Jugador3: { [Op.in]: idsJugadores } },
                { Jugador4: { [Op.in]: idsJugadores } }
            ]
        }});
        res.json({
            ok:true,
            msg:'getPartidosPorEntrenador',
            partidos
        });
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar partidos'
        });
    }
}

const createPartido = async(req,res) => {
    try {
        let {Jugador1, Jugador2, Jugador3, Jugador4, Pareja, Rival1, Rival2, NumSets, Tipo} = req.body;

        if (Tipo !== undefined && Tipo !== 0 && Tipo !== 1) {
            return res.status(400).json({
                ok: false,
                msg: "El campo Tipo solo puede ser 0 (Individual) o 1 (Dobles)"
            });
        }
        
        if (NumSets !== undefined && NumSets !== 1 && NumSets !== 3 && NumSets !== 5) {
            return res.status(400).json({
                ok: false,
                msg: "El campo NumSets solo puede ser 1, 3 o 5"
            });
        }

        let jugadorExiste = await Jugador.findByPk(Jugador1);
        if(!jugadorExiste){
            return res.json({
                ok: false,
                msg: 'Error al crear partido'
            })
        }
        
        const partido = await Partido.create({
            Jugador1,
            Jugador2,
            Jugador3,
            Jugador4,
            Pareja,
            Rival1,
            Rival2,
            NumSets,
            Tipo: Tipo ?? 0,
            FechaHoraEntrada: new Date(),
            FechaHoraSalida: null
        });

        res.json({
            ok: true,
            msg: 'Partido creado correctamente',
            partido
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear partido'
        });
    }
}

const updatePartido = async (req, res) => {
    try {
        const id = req.params.id;
        let {Jugador1, Jugador2, Jugador3,Jugador4, Pareja,Rival1, Rival2, NumSets, Tipo} = req.body;

        if (Tipo !== undefined && Tipo !== 0 && Tipo !== 1) {
            return res.status(400).json({
                ok: false,
                msg: "El campo Tipo solo puede ser 0 (Individual) o 1 (Dobles)"
            });
        }
        // Buscar si el usuario existe
        const existePartido = await Partido.findByPk(id);
        if (!existePartido) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el partido'
            });
        }

        // Actualizar usuario
        await existePartido.update({ 
            Jugador1: Jugador1 ?? existePartido.Jugador1,
            Jugador2: Jugador2 ?? existePartido.Jugador2,
            Jugador3: Jugador3 ?? existePartido.Jugador3,
            Jugador4: Jugador4 ?? existePartido.Jugador4,
            Pareja: Pareja ?? existePartido.Pareja,
            Rival1: Rival1 ?? existePartido.Rival1,
            Rival2: Rival2 ?? existePartido.Rival2,
            NumSets: NumSets ?? existePartido.NumSets,
            Tipo: Tipo ?? existePartido.Tipo,
            FechaHoraEntrada: existePartido.FechaHoraEntrada,
            FechaHoraSalida: existePartido.FechaHoraSalida
        });

        res.json({
            ok: true,
            msg: "Partido actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando partido'
        });
    }
}

const terminarPartido = async(req, res) => {
    try {
        const id = req.params.id;
        const existePartido = await Partido.findByPk(id);
        console.log(existePartido)
        if (!existePartido) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el partido'
            });
        }
        if(existePartido.FechaHoraSalida){
            return res.status(400).json({
                ok:false,
                msg: 'Este partido ya ha terminado'
            });
        }
        await existePartido.update({ 
            Jugador1:existePartido.Jugador1,
            Jugador2: existePartido.Jugador2,
            Jugador3: existePartido.Jugador3,
            Jugador4: existePartido.Jugador4,
            Rival1: existePartido.Rival1,
            Rival2: existePartido.Rival2,
            Rival3: existePartido.Rival3,
            Tipo: existePartido.Tipo,
            FechaHoraSalida: new Date()
        });

        res.json({
            ok: true,
            msg: 'partido terminado con éxito',
            partido: existePartido
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando partido'
        });
    }
}

const deletePartido = async(req,res) => {
    try{
        const id = req.params.id;
        
        const partidoExiste = await Partido.findByPk(id);
        if(!partidoExiste){
            return res.status(400).json({
                ok: false,
                msg: 'Este partido no existe'
            });
        }

        await Partido.destroy({where:{IdPartido: id}});
        
        res.json({
            ok: true,
            msg: 'partido borrado con éxito',
            partido: partidoExiste
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar partido'
        });
    }
}
    
   
module.exports = { getPartidos, getPartidosPorJugador, getPartidosPorEntrenador, createPartido, updatePartido, terminarPartido, deletePartido }