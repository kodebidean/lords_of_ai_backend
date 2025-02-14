const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { 
    validateRegistration, 
    validateLogin, 
    validateProfileUpdate 
} = require('../middleware/validation');

// Rutas públicas
router.post('/register', validateRegistration, UserController.register);
router.post('/login', validateLogin, UserController.login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', [auth, validateProfileUpdate], UserController.updateProfile);

module.exports = router; 