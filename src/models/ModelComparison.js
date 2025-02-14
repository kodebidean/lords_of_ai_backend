const pool = require('../config/database');
const logger = require('../utils/logger');

class ModelComparison {
    static async compare(modelId1, modelId2) {
        try {
            const query = `
                WITH model_metrics AS (
                    SELECT 
                        m.model_id,
                        m.name,
                        m.developer,
                        c.category_name,
                        json_agg(
                            json_build_object(
                                'name', mc.characteristic_name,
                                'value', mc.value,
                                'category', cc.name,
                                'unit', cc.unit_of_measure
                            )
                        ) as characteristics,
                        COUNT(DISTINCT br.benchmark_id) as total_benchmarks,
                        AVG(br.score) as avg_benchmark_score
                    FROM ai_models m
                    JOIN categories c ON m.category_id = c.category_id
                    LEFT JOIN model_characteristics mc ON m.model_id = mc.model_id
                    LEFT JOIN characteristic_categories cc ON mc.category_id = cc.category_id
                    LEFT JOIN benchmark_results br ON m.model_id = br.model_id
                    WHERE m.model_id IN ($1, $2)
                    GROUP BY m.model_id, m.name, m.developer, c.category_name
                )
                SELECT 
                    *,
                    (
                        SELECT json_agg(comp.*)
                        FROM model_comparisons comp
                        WHERE (comp.model_id_1 = mm.model_id OR comp.model_id_2 = mm.model_id)
                        AND comp.comparison_date >= NOW() - INTERVAL '30 days'
                    ) as recent_comparisons
                FROM model_metrics mm
            `;

            const result = await pool.query(query, [modelId1, modelId2]);
            return result.rows;
        } catch (error) {
            logger.error('Error en ModelComparison.compare:', error);
            throw error;
        }
    }
}

module.exports = ModelComparison; 