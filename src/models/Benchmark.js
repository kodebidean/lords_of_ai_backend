const pool = require('../config/database');
const logger = require('../utils/logger');

class Benchmark {
    static async findAll(categoryId = null) {
        try {
            const params = [];
            let query = `
                SELECT 
                    b.*,
                    cc.name as category_name,
                    COUNT(br.result_id) as total_results,
                    AVG(br.score) as average_score
                FROM benchmarks b
                LEFT JOIN characteristic_categories cc ON b.category_id = cc.category_id
                LEFT JOIN benchmark_results br ON b.benchmark_id = br.benchmark_id
            `;

            if (categoryId) {
                query += ` WHERE b.category_id = $1`;
                params.push(categoryId);
            }

            query += ` GROUP BY b.benchmark_id, cc.name
                      ORDER BY b.name`;

            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            logger.error('Error en Benchmark.findAll:', error);
            throw error;
        }
    }

    static async addResult(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertQuery = `
                INSERT INTO benchmark_results 
                (model_id, benchmark_id, score, execution_time, memory_usage, hardware_specs)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;

            const result = await client.query(insertQuery, [
                data.model_id,
                data.benchmark_id,
                data.score,
                data.execution_time,
                data.memory_usage,
                data.hardware_specs
            ]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error en Benchmark.addResult:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = Benchmark; 