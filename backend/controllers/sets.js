const { numeroSetsValido } = require('../helpers/numeroSetsValido');
const { partidoGanado } = require('../helpers/partidoGanado');
const { setValido } = require('../helpers/setValido');
const Partido = require('../models/partido');
const Set = require('../models/set');

const getSets = async(req, res) => {
    try {
        const id = req.params.id;
        if(id){
            const set = await Set.findByPk(id);
            if(!set){
                return res.json({
                    ok: false,
                    msg: 'set no encontrado'
                });
            }
             return res.json({
                set,
                ok: true,
                msg: 'getSetsById'
            });
        }

        const sets = await Set.findAll();
        res.json({
            sets,
            ok: true,
            msg: 'getSets'
        });
    
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar set'
        });
    }
}

const getSetsPorPartido = async (req,res) => {
    try {
        const idPartido = req.params.id;
        const partido = await Partido.findByPk(idPartido);

        if(!partido){
            return res.json({
                ok: false,
                msg: 'Parido no encontrado'
            });
        }
        const sets = await Set.findAll({where:{idPartido: idPartido}});
        if(!sets){
            return res.json({
                ok: false,
                msg:'Este partido tiene sets registrados'
            });
        }
         res.json({
            ok: true,
            msg: 'getSetsPorPartido',
            sets
         });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            ok: false,
            msg: 'Error al buscar sets'
        });
    }
}

const createSet = async(req,res) => {
    try {
        let {idPartido,numero, marcador1, marcador2} = req.body;
        
        
        let partido = await Partido.findByPk(idPartido);
        if(!partido){
            return res.json({
                ok: false,
                msg: 'Partido no encontrado'
            });
        }
        
        const numeroSets = await Set.findAndCountAll({where:{idPartido : idPartido}});
        if(numeroSets.count >= partido.dataValues.NumSets){
            return res.json({
                ok: false,
                msg: 'Este partido ya está completo'
            });
        }
        if(!numero){
            numero = numeroSets.count + 1;
        }
        if(numeroSets.count < partido.dataValues.NumSets){
            const sets = numeroSets.rows.map(set => ({
                marcador1: set.dataValues.marcador1,
                marcador2: set.dataValues.marcador2
            }));
            if(partidoGanado(sets, partido.dataValues.NumSets)){
                return res.json({
                    ok: false,
                    msg:'Este partido ya ha terminado'
                })
            }
        }
         
        const nuevoSet = await Set.create({
            idPartido,
            numero,
            marcador1,
            marcador2
        });
        
        

        res.json({
            ok: true,
            msg: 'Set creado correctamente',
            nuevoSet
            
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear set'
        });
    }
}

const updateSet = async (req, res) => {
    try {
        const id = req.params.id;
        let {idPartido,numero, marcador1, marcador2} = req.body;
        
        // Buscar si el usuario existe
        const existeSet = await Set.findByPk(id);
        if (!existeSet) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el set'
            });
        }
        if(!idPartido){
            idPartido = existeSet.dataValues.idPartido;
        }
        let partido = await Partido.findByPk(idPartido);
        if(!partido){
            return res.json({
                ok: false,
                msg: 'Partido no encontrado'
            });
        }
        
        if(!setValido(marcador1,marcador2)){
            return res.json({
                ok: false,
                msg: 'Este resultado no es válido'
            });
        }

        const numeroSets = await Set.findAndCountAll({where:{idPartido : idPartido}});
        const sets = numeroSets.rows.map(set => ({
            marcador1: set.dataValues.marcador1,
            marcador2: set.dataValues.marcador2,
            numero: set.dataValues.numero
        }));
        // Reemplazar el set que se está modificando con los nuevos valores
        const nuevoResultado = sets.map(set => set.numero == existeSet.dataValues.numero ? {marcador1: marcador1, marcador2: marcador2, numero: set.numero} : set);
        if(!numeroSetsValido(nuevoResultado, partido.dataValues.NumSets)){
            return res.json({
                ok: false,
                msg: 'Este jugador ya ha ganado'
            });
        }

        await existeSet.update({ 
            idPartido: idPartido|| existeSet.idPartido,
            numero: numero || existeSet.numero,
            marcador1: marcador1 || existeSet.marcador1,
            marcador2: marcador2 || existeSet.marcador2
        });

        res.json({
            ok: true,
            msg: "Set actualizado correctamente",
            nuevoResultado
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error actualizando set'
        });
    }
}

const deleteSet = async(req,res) => {
    try{
        const id = req.params.id;
        
        const existeSet = await Set.findByPk(id);
        if (!existeSet) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado el set'
            });
        }

        await Set.destroy({where:{Id: id}});
        
        res.json({
            ok: true,
            msg: 'set borrado con éxito',
            set: existeSet
        });
    }catch(err){
        return res.status(500).json({
            ok: false,
            msg: 'Error al borrar set'
        });
    }
}
    
   
module.exports = { getSets, getSetsPorPartido ,createSet, updateSet, deleteSet }