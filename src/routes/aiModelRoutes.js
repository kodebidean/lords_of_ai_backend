const express = require('express');
const router = express.Router();
const AiModelController = require('../controllers/aiModelController');
const auth = require('../middleware/auth');
const { 
    validateAiModel, 
    validateStatistics, 
    validateRanking 
} = require('../middleware/aiModelValidation');

// Rutas públicas
router.get('/', AiModelController.getAllModels);
router.get('/:id', AiModelController.getModelById);

// Rutas protegidas (requieren autenticación)
router.post('/', [auth, validateAiModel], AiModelController.createModel);
router.put('/:id', [auth, validateAiModel], AiModelController.updateModel);
router.post('/:id/statistics', [auth, validateStatistics], AiModelController.updateStatistics);
router.post('/:id/ranking', [auth, validateRanking], AiModelController.updateRanking);
router.post('/:id/vote', auth, AiModelController.voteModel);

module.exports = router; 