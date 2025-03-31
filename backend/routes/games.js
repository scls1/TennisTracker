const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getGames, createGame, updateGame, deleteGame, getGamesPorSet, getGamesPorPartido } = require('../controllers/games');
const router = Router();

router.get(['/','/:id'], validarJWT, getGames);
router.get('/set/:id', validarJWT, getGamesPorSet);
router.get('/partido/:id', validarJWT, getGamesPorPartido);

router.post('/', [
    check('idSet', 'El argumento idSet es obligatorio').not().isEmpty(),
    check('marcador1', 'Formato de marcador1 invalido').not().isEmpty(),
    check('marcador2', 'El argumento marcador2 es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
],createGame);

router.put('/:id', [
    check('id', 'El argumento id es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], updateGame);

router.delete('/:id', validarJWT,deleteGame);

module.exports = router;