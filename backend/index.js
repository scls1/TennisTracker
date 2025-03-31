/*
Importación de módulos
*/
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.json()); // Para que Express entienda JSON
app.use(express.urlencoded({ extended: true })); // Para datos de formularios


app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/jugadores', require('./routes/jugadores'));
app.use('/api/partidos', require('./routes/partidos'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/sets', require('./routes/sets'));
app.use('/api/games', require('./routes/games'));
app.use('/api/puntos', require('./routes/puntos'));

// Abrir la aplicacíon en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto ' + 3000);
});