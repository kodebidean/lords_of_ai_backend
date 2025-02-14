const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Obtener el token del header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'No se proporcionó token de autenticación' 
            });
        }

        // Verificar formato del token (Bearer token)
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                error: 'Formato de token inválido' 
            });
        }

        try {
            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verificar que el usuario existe
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error();
            }

            // Agregar la información del usuario al request
            req.user = decoded;
            req.token = token;
            
            next();
        } catch (error) {
            res.status(401).json({ 
                error: 'Token inválido o expirado' 
            });
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ 
            error: 'Error en la autenticación' 
        });
    }
};

module.exports = auth; 