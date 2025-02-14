const AiModel = require('../models/AiModel');
const Category = require('../models/Category');
const ModelCharacteristic = require('../models/ModelCharacteristic');
const ScoreHistory = require('../models/ScoreHistory');
const ModelComparison = require('../models/ModelComparison');
const logger = require('../utils/logger');
const { cacheMiddleware } = require('../middleware/cache');

const aiModelController = {
    // Obtener todos los modelos de IA
    async getModels(req, res) {
        try {
            const models = await AiModel.findAll();
            res.json(models);
        } catch (error) {
            console.error('Error getting models:', error);
            res.status(500).json({ message: 'Error al obtener los modelos' });
        }
    },

    // Obtener un modelo específico
    async getModelById(req, res) {
        try {
            const { id } = req.params;
            const model = await AiModel.findById(parseInt(id));
            
            if (!model) {
                return res.status(404).json({
                    success: false,
                    error: 'Modelo no encontrado'
                });
            }

            // Obtener características y historial de puntuaciones
            const [characteristics, scoreHistory] = await Promise.all([
                ModelCharacteristic.findByModelId(parseInt(id)),
                ScoreHistory.findByModelId(parseInt(id))
            ]);

            res.json({
                success: true,
                data: {
                    ...model,
                    characteristics,
                    scoreHistory
                }
            });
        } catch (error) {
            logger.error('Error en getModelById:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener el modelo'
            });
        }
    },

    // Crear nuevo modelo de IA
    async createModel(req, res) {
        try {
            const { name, developer, category_id, description, release_date } = req.body;

            const newModel = await AiModel.create({
                name,
                developer,
                category_id,
                description,
                release_date,
                likes: 0,
                dislikes: 0
            });

            res.status(201).json({
                success: true,
                message: 'Modelo de IA creado exitosamente',
                data: newModel
            });
        } catch (error) {
            console.error('Error creating model:', error);
            res.status(500).json({
                success: false,
                error: 'Error al crear el modelo de IA'
            });
        }
    },

    // Actualizar modelo de IA
    async updateModel(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedModel = await AiModel.update(parseInt(id), updateData);

            if (!updatedModel) {
                return res.status(404).json({
                    success: false,
                    error: 'Modelo no encontrado'
                });
            }

            res.json({
                success: true,
                data: updatedModel,
                message: 'Modelo actualizado exitosamente'
            });
        } catch (error) {
            logger.error('Error en updateModel:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar el modelo'
            });
        }
    },

    // Actualizar estadísticas del modelo
    async updateStatistics(req, res) {
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
    },

    // Actualizar ranking del modelo
    async updateRanking(req, res) {
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
    },

    // Votar por un modelo
    async voteModel(req, res) {
        try {
            const { id } = req.params;
            const { voteType } = req.body;

            if (!['like', 'dislike'].includes(voteType)) {
                return res.status(400).json({
                    success: false,
                    error: 'Tipo de voto inválido'
                });
            }

            const updatedModel = await AiModel.voteModel(id, voteType);

            res.json({
                success: true,
                data: updatedModel
            });
        } catch (error) {
            console.error('Error voting model:', error);
            res.status(500).json({
                success: false,
                error: 'Error al votar el modelo'
            });
        }
    },

    async getModelMetrics(req, res) {
        try {
            const { id } = req.params;
            const metrics = await AiModel.getModelMetrics(id);

            res.json({
                success: true,
                data: metrics
            });
        } catch (error) {
            console.error('Error fetching metrics:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener las métricas del modelo'
            });
        }
    },

    async deleteModel(req, res) {
        try {
            const { id } = req.params;
            const result = await AiModel.delete(parseInt(id));

            if (!result) {
                return res.status(404).json({
                    success: false,
                    error: 'Modelo no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Modelo eliminado exitosamente'
            });
        } catch (error) {
            logger.error('Error en deleteModel:', error);
            res.status(500).json({
                success: false,
                error: 'Error al eliminar el modelo'
            });
        }
    },

    async addModelMetrics(req, res) {
        try {
            const { id } = req.params;
            const { characteristic_name, value } = req.body;

            const newMetric = await ModelCharacteristic.create(id, {
                name: characteristic_name,
                value
            });

            res.status(201).json({
                success: true,
                data: newMetric
            });
        } catch (error) {
            console.error('Error adding metric:', error);
            res.status(500).json({
                success: false,
                error: 'Error al añadir la métrica'
            });
        }
    },

    async updateModelMetrics(req, res) {
        try {
            const { id, metricId } = req.params;
            const { value } = req.body;

            const updatedMetric = await ModelCharacteristic.update(metricId, value);

            res.json({
                success: true,
                data: updatedMetric
            });
        } catch (error) {
            console.error('Error updating metric:', error);
            res.status(500).json({
                success: false,
                error: 'Error al actualizar la métrica'
            });
        }
    },

    async deleteModelMetrics(req, res) {
        try {
            const { id, metricId } = req.params;
            await ModelCharacteristic.delete(metricId);

            res.json({
                success: true,
                message: 'Métrica eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error deleting metric:', error);
            res.status(500).json({
                success: false,
                error: 'Error al eliminar la métrica'
            });
        }
    },

    async addCharacteristic(req, res) {
        try {
            const { modelId } = req.params;
            const characteristicData = {
                model_id: parseInt(modelId),
                ...req.body
            };

            const characteristic = await ModelCharacteristic.add(characteristicData);

            res.status(201).json({
                success: true,
                data: characteristic
            });
        } catch (error) {
            logger.error('Error en addCharacteristic:', error);
            res.status(500).json({
                success: false,
                error: 'Error al agregar característica'
            });
        }
    },

    async compareModels(req, res) {
        try {
            const { modelId1, modelId2 } = req.params;
            const comparison = await ModelComparison.compare(
                parseInt(modelId1),
                parseInt(modelId2)
            );

            res.json({
                success: true,
                data: comparison
            });
        } catch (error) {
            logger.error('Error en compareModels:', error);
            res.status(500).json({
                success: false,
                error: 'Error al comparar modelos'
            });
        }
    }
};

module.exports = aiModelController; 