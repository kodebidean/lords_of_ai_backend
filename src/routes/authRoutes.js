const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation/authValidation');

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/verify', validateToken, AuthController.verifyToken);

module.exports = router; 