const { EventosPartido, EVENTOS } = require('../models/eventoPartido');
const Partido = require('../models/partido');
const Jugador = require('../models/jugador');

const getEventos = async(req, res) => {
    try {
        const id = req.params.id;
        if(id){
            const eventos = await EventosPartido.findAll({where:{Id_partido:id}});
            if(!eventos){
                return res.json({
                    ok: false,
                    msg: 'evento no encontrado'
                });
            }
             return res.json({
                eventos,
                ok: true,
                msg: 'getEventoPorPartido'
            });
        }

        const eventosTodos = await EventosPartido.findAll();
        res.json({
            eventos: eventosTodos,
            ok: true,
            msg: 'getEventos'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar eventos'
        });
    }
}

const getEventosDePartidoPorTipo = async(req, res) => {
    try {
        const id = req.params.id;
        const tipo = req.params.tipo;
        if(!Object.values(EVENTOS).includes(Number(tipo))){
            return res.json({
                ok: false,
                msg: 'Este tipo no existe'
            });
        }
        const partidoExiste = await Partido.findByPk(id);
        if(!partidoExiste){
            return res.json({
                ok: false,
                msg: 'partido no encontrado'
            });
        }
        const eventosTodos = await EventosPartido.findAll({where:{Id_partido:id}});
        if(!eventosTodos){
            return res.json({
                ok: false,
                msg: 'eventos no encontrados'
            });
        }
        const eventos = eventosTodos.filter(evento => evento.Id_evento === Number(tipo));

        if(eventos.length == 0){
            return res.json({
                ok: false,
                msg: 'evento de este tipo no encontrado'
            });
        }
        res.json({
            eventos,
            ok: true,
            msg: 'getEventoDePartidoPorTipo'
        });
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar eventos'
        });
    }
}

const createEvento = async(req,res) => {
 
    try {
        let {Id_partido ,Id_jugador, Id_evento} = req.body;
        let partidoExiste = await Partido.findOne({ where: { IdPartido: Id_partido }});
        if(!partidoExiste){
            return res.json({
                ok: false,
                msg: 'partido no encontrado'
            })
        }
        let jugadorExiste = await Jugador.findOne({ where: { IdJugador: Id_jugador }});
        if(!jugadorExiste){
            return res.json({
                ok: false,
                msg: 'jugador no encontrado'
            })
        }

        const evento = await EventosPartido.create({
            Id_partido,
            Id_jugador,
            Id_evento,
            Fecha_hora: new Date()
        });

        res.json({
            ok: true,
            msg: 'Evento creado correctamente',
            evento
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear evento'
        });
    }
}

const updateEvento = async (req, res) => {
    try {
        const id = req.params.id;
        let {Id_partido ,Id_jugador, Id_evento} = req.body;
        
        const existeEvento = await EventosPartido.findByPk(id);
        if (!existeEvento) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el evento'
            });
        }
        


        // Actualizar usuario
        await existeEvento.update({ 
            Id_partido: Id_partido ?? existeEvento.Id_partido,
            Id_jugador: Id_jugador ?? existeEvento.Id_jugador,
            Id_evento: Id_evento ?? existeEvento.Id_evento,
            Fecha_hora: existeEvento.Fecha_hora
        });

        res.json({
            ok: true,
            msg: "Evento actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando evento'
        });
    }
}

const deleteEvento = async(req,res) => {
    try{
        const id = req.params.id;
        
        const eventoExiste = await EventosPartido.findByPk(id);
        if(!eventoExiste){
            return res.status(400).json({
                ok: false,
                msg: 'Este evento no existe'
            });
        }

        await EventosPartido.destroy({where:{Id: id}});
        
        res.json({
            ok: true,
            msg: 'Evento borrado con éxito',
            evento: eventoExiste
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar evento'
        });
    }
}
    
   
module.exports = { getEventos, getEventosDePartidoPorTipo, createEvento, updateEvento, deleteEvento }