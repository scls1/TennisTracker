const jwt = require('jsonwebtoken');
const generarJWT = (id) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id
        }
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '1y'
        }, (err, token) => {
            if (err) {
                console.error(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}
module.exports = { generarJWT }