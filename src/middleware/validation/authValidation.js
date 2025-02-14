const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'El nombre de usuario no puede estar vacío',
            'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
            'string.max': 'El nombre de usuario no puede exceder los 30 caracteres',
            'string.alphanum': 'El nombre de usuario solo puede contener letras y números'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'El email debe ser válido',
            'string.empty': 'El email no puede estar vacío'
        }),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
        })
}); 
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'El email debe ser válido',
            'string.empty': 'El email no puede estar vacío'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'La contraseña no puede estar vacía'
        })
});

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        
        return res.status(400).json({
            message: 'Error de validación',
            errors
        });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        
        return res.status(400).json({
            message: 'Error de validación',
            errors
        });
    }
    
    next();
};

module.exports = {
    validateRegister,
    validateLogin
}; 