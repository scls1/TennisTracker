const { gameActualizadoValido } = require("../helpers/gameActualizadoValido");
const { gameValido } = require("../helpers/gameValido");
const Game = require("../models/game");
const Partido = require("../models/partido");
const Set = require("../models/set");

const getGames = async(req, res) => {
    try {
        const id = req.params.id;
        if(id){
            const game = await Game.findByPk(id);
            if(!game){
                return res.json({
                    ok: false,
                    msg: 'game no encontrado'
                });
            }
             return res.json({
                game,
                ok: true,
                msg: 'getGameById'
            });
        }

        const games = await Game.findAll();
        res.json({
            games,
            ok: true,
            msg: 'getGames'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar game'
        });
    }
}

const getGamesPorSet = async(req, res) => {
    try {
        const id = req.params.id;
        
        const set = await Set.findByPk(id);
        if(!set){
            return res.json({
                ok: false,
                msg: 'Set no encontrado' 
            });
        }

        const games = await Game.findAll({
            where: { idSet: id }             
        });
        res.json({
            games,
            ok: true,
            msg: 'getGamesPorSet'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar games'
        });
    }
}

const getGamesPorPartido = async(req, res) => {
    try {
        const id = req.params.id;
        
        const partido = await Partido.findByPk(id);
        if(!partido){
            return res.json({
                ok: false,
                msg: 'Partido no encontrado' 
            });
        }

        const games = await Game.findAll({
            include: [
                {
                model: Set,
                where: { idPartido: id } 
                }
            ]
          });
        res.json({
            games,
            ok: true,
            msg: 'getGamesPorPartido'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar games'
        });
    }
}

const createGame = async(req,res) => {
    try {
        let {idSet, numero, marcador1, marcador2} = req.body;
        
        let set = await Set.findByPk(idSet);
        if(!set){
            return res.json({
                ok: false,
                msg: 'Set no encontrado'
            });
        }

        const numeroGames = await Game.findAndCountAll({where:{idSet : idSet}});
        if(!numero){
            numero = numeroGames.count + 1;
        }
        const games = numeroGames.rows.map(game => ({numero: game.dataValues.numero, marcador1: game.dataValues.marcador1, marcador2:game.dataValues.marcador2}));
        const nuevoGame = {numero, marcador1, marcador2};
        console.log('nuevo game: ',nuevoGame);
        console.log('games anteriores: ',games);
        if(!gameValido(games, nuevoGame)){
            return res.json({
                ok:false,
                msg: 'Imposible crear este game'
            });
        }
        
        const game = await Game.create({
            idSet,
            numero,
            marcador1,
            marcador2
        });

        res.json({
            ok: true,
            msg: 'Game creado correctamente',
            game
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear game'
        });
    }
}

const updateGame = async (req, res) => {
    try {
        let {idSet, numero, marcador1, marcador2} = req.body;
        const id = req.params.id;
        const game = await Game.findByPk(id);
        if(!game){
            return res.json({
                ok: false,
                msg: 'game no encontrado'
            });
        }
        
        if(!idSet){
            idSet = game.dataValues.idSet;    
        }
        if(!numero){
            numero = game.dataValues.numero;
        }
        if(!marcador1){
            marcador1 = game.dataValues.marcador1;
        }
        if(!marcador2){
            marcador2 = game.dataValues.marcador2;
        }
        let set = await Set.findByPk(idSet);
        if(!set){
            return res.json({
                ok: false,
                msg: 'Set no encontrado'
            });
        }

        if(!gameActualizadoValido(marcador1,marcador2)){
            return res.json({
                ok: false,
                msg: 'Resultado invalido'
            });
        }
        
        await game.update({ 
            idSet,
            numero,
            marcador1,
            marcador2
        });

        res.json({
            ok: true,
            msg: "Game actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando game'
        });
    }
}

const deleteGame = async(req,res) => {
    try{
        const id = req.params.id;
        
        const gameExiste = await Game.findByPk(id);
        if(!gameExiste){
            return res.status(400).json({
                ok: false,
                msg: 'Este game no existe'
            });
        }

        await Game.destroy({where:{id: id}});
        
        res.json({
            ok: true,
            msg: 'game borrado con éxito',
            game: gameExiste
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar game'
        });
    }
}
    
   
module.exports = { getGames, getGamesPorSet, getGamesPorPartido, createGame, updateGame, deleteGame }