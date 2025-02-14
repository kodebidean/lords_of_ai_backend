const express = require('express');
const router = express.Router();
const ComparisonController = require('../controllers/comparisonController');

router.get('/', ComparisonController.getComparisons);
router.get('/:id', ComparisonController.getComparisonById);
router.post('/', ComparisonController.createComparison);
router.put('/:id', ComparisonController.updateComparison);
router.delete('/:id', ComparisonController.deleteComparison);

module.exports = router; 