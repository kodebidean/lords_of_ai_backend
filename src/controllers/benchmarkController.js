const Benchmark = require('../models/Benchmark');
const logger = require('../utils/logger');

class BenchmarkController {
    static async getBenchmarks(req, res) {
        try {
            const { category_id } = req.query;
            const benchmarks = await Benchmark.findAll(category_id);
            res.json({
                success: true,
                data: benchmarks
            });
        } catch (error) {
            logger.error('Error en getBenchmarks:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener benchmarks'
            });
        }
    }

    static async addBenchmarkResult(req, res) {
        try {
            const { model_id } = req.params;
            const { benchmark_id, score, execution_time, memory_usage } = req.body;
            
            const result = await Benchmark.addResult({
                model_id,
                benchmark_id,
                score,
                execution_time,
                memory_usage,
                hardware_specs: req.body.hardware_specs
            });

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            logger.error('Error en addBenchmarkResult:', error);
            res.status(500).json({
                success: false,
                error: 'Error al agregar resultado de benchmark'
            });
        }
    }
}

module.exports = BenchmarkController; 