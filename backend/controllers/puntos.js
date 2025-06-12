const { crearNuevoGame } = require('../helpers/crearNuevoGame');
const { gameTerminado } = require('../helpers/gameTerminado');
const { puntoActualizadoValido } = require('../helpers/puntoActualizadoValido');
const { puntoValido } = require('../helpers/puntoValido');
const Game = require('../models/game');
const Partido = require('../models/partido');
const Punto = require('../models/punto');
const Set = require('../models/set');

const getPuntos = async(req, res) => {
    const id = req.params.id;
    try {
        if(id){
            const punto = await Punto(id);
            if(!punto){
                return res.json({
                    ok: false,
                    msg: 'punto no encontrado'
                });
            }
             return res.json({
                punto,
                ok: true,
                msg: 'getPuntosById'
            });
        }

        const puntos = await Punto.findAll();
        res.json({
            puntos,
            ok: true,
            msg: 'getPuntos'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar punto'
        });
    }
}

const getPuntosPorGame = async(req, res) => {
    try {
        const id = req.params.id;
        
        const game = await Game.findByPk(id);
        if(!game){
            return res.json({
                ok: false,
                msg: 'Game no encontrado' 
            });
        }

        const puntos = await Punto.findAll({
            where: {idGame:id}
        });
        res.json({
            puntos,
            ok: true,
            msg: 'getPuntosPorGame'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar puntos'
        });
    }
}

const getPuntosPorSet = async(req, res) => {
    try {
        const id = req.params.id;
        
        const set = await Set.findByPk(id);
        if(!set){
            return res.json({
                ok: false,
                msg: 'Set no encontrado' 
            });
        }

        const puntos = await Punto.findAll({
            include: {
                model: Game,
                where: { idSet: id } // Filtra los games por el idSet dado
            }
        });
        res.json({
            puntos,
            ok: true,
            msg: 'getPuntosPorSet'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar puntos'
        });
    }
}

const getPuntosPorPartido = async(req, res) => {
    try {
        const id = req.params.id;
        
        const partido = await Partido.findByPk(id);
        if(!partido){
            return res.json({
                ok: false,
                msg: 'Partido no encontrado' 
            });
        }

        const puntos = await Punto.findAll({
            include: [
              {
                model: Game,
                include: [
                  {
                    model: Set,
                    where: { idPartido: id }  // Filtra por el idPartido
                  }
                ]
              }
            ]
          });
        res.json({
            puntos,
            ok: true,
            msg: 'getPuntosPorPartido'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar puntos'
        });
    }
}

const createPunto = async(req,res) => {
    try {
        let {idGame, numero, marcador1, marcador2} = req.body;

        let game = await Game.findByPk(idGame);
        if(!game){
            return res.json({
                ok: false,
                msg: 'Game no encontrado'
            });
        }
        const esTiebreak = game.dataValues.marcador1 === 6 && game.dataValues.marcador2 === 6;
        const idSet = game.dataValues.idSet;
        
        
        const puntos = await Punto.findAndCountAll({
            where: { idGame }
        });
        if(!numero){
            numero = puntos.count + 1;
        }

        const infoPuntos = puntos.rows.map(punto => ({
            marcador1: punto.marcador1, 
            marcador2: punto.marcador2, 
            numero: punto.numero
        }));
        let nuevoPunto = { marcador1, marcador2, numero };
        if (!puntoValido(infoPuntos, nuevoPunto, esTiebreak)) {
            return res.status(400).json({
                ok: false,
                msg: 'Punto inválido'
            });
        }
        
        const punto = await Punto.create({
            idGame, 
            numero, 
            marcador1, 
            marcador2
        });

        // if(gameTerminado(nuevoPunto, esTiebreak)){
        //     let ganador;
        //     if(nuevoPunto.marcador1 === 60){
        //         ganador = 1;
        //     }
        //     if(nuevoPunto.marcador2 === 60){
        //         ganador = 2;
        //     }

        //     crearNuevoGame(idSet, ganador);
        // }
        
        res.json({
            ok: true,
            msg: 'Punto creado correctamente',
            punto
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear punto'
        });
    }
}

const updatePunto = async (req, res) => {
    try {
        let {idGame, numero, marcador1, marcador2} = req.body;
        const id = req.params.id;
        const punto = await Punto.findByPk(id);
        if(!punto){
            return res.json({
                ok: false,
                msg: 'punto no encontrado'
            });
        }
        
        if(!idGame){
            idGame = punto.dataValues.idGame;    
        }
        if(!numero){
            numero = punto.dataValues.numero;
        }
        if(!marcador1){
            marcador1 = punto.dataValues.marcador1;
        }
        if(!marcador2){
            marcador2 = punto.dataValues.marcador2;
        }
        let game = await Game.findByPk(idGame);
        if(!game){
            return res.json({
                ok: false,
                msg: 'Game no encontrado'
            });
        }

        if(!puntoActualizadoValido(marcador1,marcador2)){
            return res.json({
                ok: false,
                msg: 'Resultado invalido'
            });
        }
        
        await punto.update({ 
            idGame,
            numero,
            marcador1,
            marcador2
        });

        res.json({
            ok: true,
            msg: "Punto actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando punto'
        });
    }
}

const deletePunto = async(req,res) => {
    try{
        const id = req.params.id;
        
        const puntoExiste = await Punto.findByPk(id);
        if(!puntoExiste){
            return res.status(400).json({
                ok: false,
                msg: 'Este punto no existe'
            });
        }

        await Punto.destroy({where:{id: id}});
        
        res.json({
            ok: true,
            msg: 'punto borrado con éxito',
            punto: puntoExiste
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar punto'
        });
    }
}
    
   
module.exports = { getPuntos, getPuntosPorGame, getPuntosPorSet, getPuntosPorPartido, createPunto, updatePunto, deletePunto }