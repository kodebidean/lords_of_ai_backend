const Joi = require('joi');

const aiModelSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'El nombre no puede estar vacío',
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder los 100 caracteres'
        }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'La descripción no puede estar vacía',
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder los 1000 caracteres'
        }),

    category_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'La categoría debe ser un número',
            'number.integer': 'La categoría debe ser un número entero',
            'number.positive': 'La categoría debe ser un número positivo'
        }),

    developer: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'El desarrollador no puede estar vacío',
            'string.min': 'El desarrollador debe tener al menos 2 caracteres',
            'string.max': 'El desarrollador no puede exceder los 100 caracteres'
        }),

    release_date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'La fecha de lanzamiento debe ser una fecha válida',
            'date.format': 'La fecha debe estar en formato ISO'
        }),

    version: Joi.string()
        .pattern(/^\d+\.\d+\.\d+$/)
        .required()
        .messages({
            'string.pattern.base': 'La versión debe seguir el formato semántico (ejemplo: 1.0.0)'
        }),

    website_url: Joi.string()
        .uri()
        .allow('')
        .optional()
        .messages({
            'string.uri': 'La URL del sitio web debe ser válida'
        }),

    documentation_url: Joi.string()
        .uri()
        .allow('')
        .optional()
        .messages({
            'string.uri': 'La URL de la documentación debe ser válida'
        })
});

const validateAiModel = (req, res, next) => {
    const { error } = aiModelSchema.validate(req.body, { abortEarly: false });
    
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
    validateAiModel
}; 