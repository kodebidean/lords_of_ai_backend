const ModelComparison = require('../models/ModelComparison');
const logger = require('../utils/logger');

class ModelComparisonController {
    static async compareModels(req, res) {
        try {
            const { model_id_1, model_id_2 } = req.params;
            const comparison = await ModelComparison.compare(model_id_1, model_id_2);
            
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

    static async getModelVersionComparison(req, res) {
        try {
            const { model_id, version1, version2 } = req.params;
            const comparison = await ModelComparison.compareVersions(model_id, version1, version2);
            
            res.json({
                success: true,
                data: comparison
            });
        } catch (error) {
            logger.error('Error en getModelVersionComparison:', error);
            res.status(500).json({
                success: false,
                error: 'Error al comparar versiones'
            });
        }
    }
}

module.exports = ModelComparisonController; 