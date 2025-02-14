const ModelVersion = require('../models/ModelVersion');
const logger = require('../utils/logger');

class ModelVersionController {
    static async getVersions(req, res) {
        try {
            const { modelId } = req.params;
            const versions = await ModelVersion.findByModel(parseInt(modelId));
            
            res.json({
                success: true,
                data: versions
            });
        } catch (error) {
            logger.error('Error en getVersions:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener versiones del modelo'
            });
        }
    }

    static async addVersion(req, res) {
        try {
            const { modelId } = req.params;
            const versionData = {
                model_id: parseInt(modelId),
                ...req.body
            };

            const newVersion = await ModelVersion.add(versionData);

            res.status(201).json({
                success: true,
                data: newVersion
            });
        } catch (error) {
            logger.error('Error en addVersion:', error);
            res.status(500).json({
                success: false,
                error: 'Error al agregar versión'
            });
        }
    }
}

module.exports = ModelVersionController; 