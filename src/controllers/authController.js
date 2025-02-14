const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está registrado'
                });
            }

            // Crear nuevo usuario
            const user = await User.create({
                username,
                email,
                password
            });

            // Generar token
            const token = jwt.sign(
                {
                    id: user.user_id,
                    role: 'user'  // Esto lo manejamos aquí, no en el modelo
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(201).json({
                success: true,
                token,
                user: {
                    id: user.user_id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            logger.error('Error en registro:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al registrar usuario'
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Buscar usuario
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = jwt.sign(
                { id: user.user_id, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: user.user_id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            logger.error('Error en login:', error);
            return res.status(500).json({
                success: false,
                error: 'Error en el servidor'
            });
        }
    }

    static async verifyToken(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.user_id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            logger.error('Error en verifyToken:', error);
            res.status(500).json({
                success: false,
                error: 'Error al verificar token'
            });
        }
    }
}

module.exports = AuthController; 