const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Importar middlewares
const { apiLimiter } = require('./middleware/cache');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const routes = require('./routes');

// Inicializar app
const app = express();

// Middlewares de seguridad y optimización
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting para todas las rutas
app.use('/api', apiLimiter);

// Ruta de estado
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date(),
        service: 'Lords of AI API',
        version: process.env.npm_package_version
    });
});

// Rutas de la API
app.use('/api', routes);

// Manejador de errores global
app.use(errorHandler);

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada' 
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend ejecutándose en el puerto ${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
});

module.exports = app; 