const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const aiModelRoutes = require('./routes/aiModelRoutes');

// Inicializar app
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date(),
        service: 'Lords of AI API'
    });
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/ai-models', aiModelRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada' 
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
});

module.exports = app; 