const Joi = require('joi');

const modelSchemas = {
    createModel: Joi.object({
        name: Joi.string().required().min(3).max(100),
        developer: Joi.string().required(),
        category_id: Joi.number().required(),
        description: Joi.string().required(),
        release_date: Joi.date().iso().required()
    }),

    updateModel: Joi.object({
        name: Joi.string().min(3).max(100),
        developer: Joi.string(),
        category_id: Joi.number(),
        description: Joi.string(),
        release_date: Joi.date().iso()
    }),

    addCharacteristic: Joi.object({
        characteristic_name: Joi.string().required(),
        value: Joi.number().required(),
        category_id: Joi.number().required(),
        confidence_level: Joi.number().min(0).max(1),
        measurement_method: Joi.string(),
        source_url: Joi.string().uri()
    }),

    addVersion: Joi.object({
        version_number: Joi.string().required(),
        release_date: Joi.date().iso().required(),
        changes_description: Joi.string().required(),
        is_major_update: Joi.boolean(),
        performance_impact: Joi.number()
    })
};

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        next();
    };
};

module.exports = {
    validateModel: validateRequest(modelSchemas.createModel),
    validateModelUpdate: validateRequest(modelSchemas.updateModel),
    validateCharacteristic: validateRequest(modelSchemas.addCharacteristic),
    validateVersion: validateRequest(modelSchemas.addVersion)
}; 