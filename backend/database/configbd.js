const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tennisTracker', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Desactiva logs de SQL en la consola (opcional)
});

// Verificar conexión
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = sequelize;