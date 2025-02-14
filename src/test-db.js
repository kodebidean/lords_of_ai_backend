const pool = require('./config/database');

async function testConnection() {
    try {
        console.log('Intentando conectar con configuración:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER
        });
        
        const client = await pool.connect();
        console.log('Conexión exitosa a la base de datos');
        const result = await client.query('SELECT NOW()');
        console.log('Timestamp actual de la base de datos:', result.rows[0].now);
        client.release();
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        console.error('Detalles de conexión:', {
            errorCode: err.code,
            errorMessage: err.message,
            address: err.address,
            port: err.port
        });
    } finally {
        pool.end();
    }
}

testConnection(); 