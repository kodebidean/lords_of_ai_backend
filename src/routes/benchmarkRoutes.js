const express = require('express');
const router = express.Router();
const BenchmarkController = require('../controllers/benchmarkController');
const { validateBenchmarkResult } = require('../middleware/validation');

router.get('/', BenchmarkController.getBenchmarks);
router.get('/:id', BenchmarkController.getBenchmarkById);
router.post('/', BenchmarkController.createBenchmark);
router.put('/:id', BenchmarkController.updateBenchmark);
router.delete('/:id', BenchmarkController.deleteBenchmark);

module.exports = router;