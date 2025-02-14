const express = require('express');
const router = express.Router();
const AiModelController = require('../controllers/aiModelController');
const { validateToken } = require('../middleware/auth');
const { validateAiModel } = require('../middleware/validation/aiModelValidation');

// Rutas públicas
router.get('/', AiModelController.getModels);
router.get('/:id', AiModelController.getModelById);
router.get('/:id/metrics', AiModelController.getModelMetrics);

// Rutas que requieren autenticación
router.post('/:id/vote', validateToken, AiModelController.voteModel);
router.post('/', validateToken, validateAiModel, AiModelController.createModel);
router.put('/:id', validateToken, validateAiModel, AiModelController.updateModel);
router.delete('/:id', validateToken, AiModelController.deleteModel);
router.post('/:id/metrics', validateToken, AiModelController.addModelMetrics);
router.put('/:id/metrics/:metricId', validateToken, AiModelController.updateModelMetrics);
router.delete('/:id/metrics/:metricId', validateToken, AiModelController.deleteModelMetrics);

module.exports = router; 