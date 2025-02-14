const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Verificar conexión
pool.on('connect', () => {
    console.log('Base de datos conectada exitosamente');
});

pool.on('error', (err) => {
    console.error('Error en la conexión de la base de datos:', err);
});

module.exports = pool; 