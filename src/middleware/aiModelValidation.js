const validateAiModel = (req, res, next) => {
    const { name, developer, category_id, description } = req.body;

    if (!name || !developer || !category_id || !description) {
        return res.status(400).json({
            success: false,
            error: 'Todos los campos son requeridos: name, developer, category_id, description'
        });
    }

    next();
};

const validateMetrics = (req, res, next) => {
    const { characteristic_name, value } = req.body;

    const validCharacteristics = [
        'precision',
        'exactitud',
        'sensibilidad',
        'puntuacion_f1',
        'perdida',
        'tiempo_inferencia',
        'uso_memoria',
        'tasa_aprendizaje',
        'generalizacion',
        'robustez',
        'eficiencia_computacional',
        'convergencia'
    ];

    if (!characteristic_name || !validCharacteristics.includes(characteristic_name)) {
        return res.status(400).json({
            success: false,
            error: `La característica debe ser una de las siguientes: ${validCharacteristics.join(', ')}`
        });
    }

    if (typeof value !== 'number' || value < 0 || value > 100) {
        return res.status(400).json({
            success: false,
            error: 'El valor debe ser un número entre 0 y 100'
        });
    }

    next();
};

const validateStatistics = (req, res, next) => {
    const { metric, value } = req.body;

    // Validar métrica
    const validMetrics = ['accuracy', 'speed', 'efficiency', 'reliability', 'cost'];
    if (!metric || !validMetrics.includes(metric)) {
        return res.status(400).json({
            success: false,
            error: `La métrica debe ser una de las siguientes: ${validMetrics.join(', ')}`
        });
    }

    // Validar valor
    if (typeof value !== 'number' || value < 0 || value > 100) {
        return res.status(400).json({
            success: false,
            error: 'El valor debe ser un número entre 0 y 100'
        });
    }

    next();
};

const validateRanking = (req, res, next) => {
    const { category, rank, score } = req.body;

    // Validar categoría
    const validCategories = ['overall', 'text', 'image', 'video', 'audio', 'code', 'multimodal'];
    if (!category || !validCategories.includes(category)) {
        return res.status(400).json({
            success: false,
            error: `La categoría debe ser una de las siguientes: ${validCategories.join(', ')}`
        });
    }

    // Validar rank
    if (!Number.isInteger(rank) || rank < 1) {
        return res.status(400).json({
            success: false,
            error: 'El rank debe ser un número entero positivo'
        });
    }

    // Validar score
    if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({
            success: false,
            error: 'El score debe ser un número entre 0 y 100'
        });
    }

    next();
};

module.exports = {
    validateAiModel,
    validateMetrics,
    validateStatistics,
    validateRanking
}; 