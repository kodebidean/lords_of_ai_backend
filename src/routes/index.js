const express = require('express');
const router = express.Router();

// Importar rutas principales
const userRoutes = require('./userRoutes');
const aiModelRoutes = require('./aiModelRoutes');
const authRoutes = require('./authRoutes');

// Middleware de autenticación
const { validateToken } = require('../middleware/auth');

// Rutas públicas
router.use('/auth', authRoutes);
router.use('/models', aiModelRoutes);

// Rutas protegidas
router.use('/users', validateToken, userRoutes);

module.exports = router; 