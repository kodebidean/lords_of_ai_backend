const validateAiModel = (req, res, next) => {
    const { name, developer, release_date, description, category } = req.body;
    const isUpdate = req.method === 'PUT';

    // Para creación, validar todos los campos
    // Para actualización, validar solo los campos presentes
    if (name && name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'El nombre del modelo debe tener al menos 2 caracteres'
        });
    }

    if (developer && developer.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'El nombre del desarrollador debe tener al menos 2 caracteres'
        });
    }

    if (release_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(release_date)) {
            return res.status(400).json({
                success: false,
                error: 'La fecha debe tener el formato YYYY-MM-DD'
            });
        }
    }

    if (description && description.trim().length < 10) {
        return res.status(400).json({
            success: false,
            error: 'La descripción debe tener al menos 10 caracteres'
        });
    }

    if (category) {
        const validCategories = ['text', 'image', 'video', 'audio', 'code', 'multimodal'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                error: `La categoría debe ser una de las siguientes: ${validCategories.join(', ')}`
            });
        }
    }

    // Si es creación, verificar que todos los campos requeridos estén presentes
    if (!isUpdate && (!name || !developer || !description || !category)) {
        return res.status(400).json({
            success: false,
            error: 'Todos los campos son requeridos para crear un modelo'
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
    validateStatistics,
    validateRanking
}; 