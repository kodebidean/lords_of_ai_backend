const pool = require('../config/database');

class ScoreHistory {
    static async findByModelId(modelId) {
        try {
            const query = `
                SELECT * FROM score_history 
                WHERE model_id = $1 
                ORDER BY recorded_at DESC
            `;
            const result = await pool.query(query, [modelId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching score history: ${error.message}`);
        }
    }

    static async create(modelId, score) {
        try {
            const query = `
                INSERT INTO score_history 
                (model_id, score) 
                VALUES ($1, $2) 
                RETURNING *
            `;
            const result = await pool.query(query, [modelId, score]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating score history: ${error.message}`);
        }
    }
}

module.exports = ScoreHistory; 