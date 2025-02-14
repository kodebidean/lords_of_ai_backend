const AiModel = require('../models/AiModel');

class AiModelController {
    // Obtener todos los modelos de IA
    static async getAllModels(req, res) {
        try {
            const { category, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const models = await AiModel.findAll({
                category,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.json({
                success: true,
                data: models,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener los modelos de IA'
            });
        }
    }

    // Obtener un modelo específico
    static async getModelById(req, res) {
        try {
            const { id } = req.params;
            const model = await AiModel.findById(id);

            if (!model) {
                return res.status(404).json({
                    success: false,
                    error: 'Modelo de IA no encontrado'
                });
            }

            res.json({
                success: true,
                data: model
            });
        } catch (error) {
            console.error('Error al obtener modelo:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener el modelo de IA'
            });
        }
    }

    // Crear nuevo modelo de IA
    static async createModel(req, res) {
        try {
            const { name, developer, release_date, description, category } = req.body;

            const newModel = await AiModel.create({
                name,
                developer,
                release_date,
                description,
                category
            });

            res.status(201).json({
                success: true,
                message: 'Modelo de IA creado exitosamente',
                data: newModel
            });
        } catch (error) {
            console.error('Error al crear modelo:', error);
            res.status(500).json({
                success: false,
                error: 'Error al crear el modelo de IA'
            });
        }
    }

    // Actualizar modelo de IA
    static async updateModel(req, res) {
        try {
            const { id } = req.params;
            const { name, developer, release_date, description, category } = req.body;

            const updatedModel = await AiModel.update(id, {
                name,
                developer,
                release_date,
                description,
                category
            });

            if (!updatedModel) {
                return res.status(404).json({
                    success: false,
                    error: 'Modelo de IA no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Modelo de IA actualizado exitosamente',
                data: updatedModel
            });
        } catch (error) {
            console.error('Error al actualizar modelo:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar el modelo de IA'
            });
        }
    }

    // Actualizar estadísticas del modelo
    static async updateStatistics(req, res) {
        try {
            const { id } = req.params;
            const { metric, value } = req.body;

            const updatedStats = await AiModel.updateStatistics(id, {
                metric,
                value
            });

            res.json({
                success: true,
                message: 'Estadísticas actualizadas exitosamente',
                data: updatedStats
            });
        } catch (error) {
            console.error('Error al actualizar estadísticas:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar las estadísticas'
            });
        }
    }

    // Actualizar ranking del modelo
    static async updateRanking(req, res) {
        try {
            const { id } = req.params;
            const { category, rank, score } = req.body;

            const updatedRanking = await AiModel.updateRanking(id, {
                category,
                rank,
                score
            });

            res.json({
                success: true,
                message: 'Ranking actualizado exitosamente',
                data: updatedRanking
            });
        } catch (error) {
            console.error('Error al actualizar ranking:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar el ranking'
            });
        }
    }

    // Votar por un modelo
    static async voteModel(req, res) {
        try {
            const { id } = req.params;
            const { vote } = req.body;
            const userId = req.user.userId; // Desde el middleware de auth

            // Validar el voto (1 o -1)
            if (vote !== 1 && vote !== -1) {
                return res.status(400).json({
                    success: false,
                    error: 'El voto debe ser 1 (positivo) o -1 (negativo)'
                });
            }

            const userVote = await AiModel.vote(id, userId, vote);

            res.json({
                success: true,
                message: 'Voto registrado exitosamente',
                data: userVote
            });
        } catch (error) {
            console.error('Error al registrar voto:', error);
            res.status(500).json({
                success: false,
                error: 'Error al registrar el voto'
            });
        }
    }
}

module.exports = AiModelController; 