const app = require('./app');
const logger = require('./utils/logger');
const pool = require('./config/database');

const PORT = process.env.PORT || 3001;

// Verificar conexión a la base de datos antes de iniciar el servidor
pool.connect()
    .then(() => {
        logger.info('Conexión exitosa a la base de datos');
        
        app.listen(PORT, () => {
            logger.info(`Servidor ejecutándose en el puerto ${PORT}`);
            logger.info(`API disponible en http://localhost:${PORT}/api`);
        });
    })
    .catch(err => {
        logger.error('Error al conectar con la base de datos:', err);
        process.exit(1);
    });

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    logger.info('SIGTERM recibido. Cerrando servidor...');
    pool.end();
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT recibido. Cerrando servidor...');
    pool.end();
    process.exit(0);
}); 