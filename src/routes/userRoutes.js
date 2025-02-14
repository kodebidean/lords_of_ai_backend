const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../middleware/auth');
const { 
    validateRegistration, 
    validateLogin, 
    validateProfileUpdate 
} = require('../middleware/validation');

// Rutas públicas
router.post('/register', validateRegistration, userController.register);
router.post('/login', validateLogin, userController.login);

// Rutas protegidas
router.get('/profile', validateToken, userController.getProfile);
router.put('/profile', validateToken, userController.updateProfile);

// Si tienes una ruta que está causando el error, asegúrate de que tenga un controlador válido
// Por ejemplo, esta es la forma correcta:
router.get('/users', validateToken, userController.getAllUsers);

module.exports = router; 