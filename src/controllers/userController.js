const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    // Registro de usuario
    register: async (req, res) => {
        try {
            const { username, email, password, bio } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ 
                    error: 'El correo electrónico ya está registrado' 
                });
            }

            // Crear nuevo usuario
            const newUser = await User.create({
                username,
                email,
                password,
                bio
            });

            // Generar token JWT
            const token = jwt.sign(
                { userId: newUser.user_id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: {
                    id: newUser.user_id,
                    username: newUser.username,
                    email: newUser.email,
                    bio: newUser.bio,
                    created_at: newUser.created_at
                },
                token
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ 
                error: 'Error al registrar usuario' 
            });
        }
    },

    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ 
                    error: 'Credenciales inválidas' 
                });
            }

            // Validar contraseña
            const isValidPassword = await User.validatePassword(
                password, 
                user.password_hash
            );
            
            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Credenciales inválidas' 
                });
            }

            // Generar token con configuración explícita
            const token = jwt.sign(
                { userId: user.user_id },
                process.env.JWT_SECRET,
                { 
                    expiresIn: '24h',
                    algorithm: 'HS256' // Especificar algoritmo
                }
            );

            res.json({
                message: 'Login exitoso',
                user: {
                    id: user.user_id,
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    profile_image_url: user.profile_image_url
                },
                token
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                error: 'Error al iniciar sesión' 
            });
        }
    },

    // Obtener perfil de usuario
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar perfil de usuario
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId; // Viene del middleware de auth
            const { username, email, bio, profile_image_url } = req.body;

            const updatedUser = await User.update(userId, {
                username,
                email,
                bio,
                profile_image_url
            });

            res.json({
                message: 'Perfil actualizado exitosamente',
                user: {
                    id: updatedUser.user_id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    bio: updatedUser.bio,
                    profile_image_url: updatedUser.profile_image_url,
                    created_at: updatedUser.created_at
                }
            });

        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            res.status(500).json({ 
                error: 'Error al actualizar perfil de usuario' 
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController; 