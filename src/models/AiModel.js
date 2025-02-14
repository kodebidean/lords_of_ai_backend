const pool = require('../config/database');

class AiModel {
    static async create({ name, developer, release_date, description, category }) {
        try {
            const query = `
                INSERT INTO ai_models (name, developer, release_date, description, category)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const values = [name, developer, release_date, description, category];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating AI model: ${error.message}`);
        }
    }

    static async findAll({ category = null, limit = 10, offset = 0 }) {
        try {
            let query = `
                SELECT 
                    m.*,
                    r.rank,
                    r.score,
                    COUNT(DISTINCT uv.vote_id) as total_votes,
                    COALESCE(SUM(uv.vote), 0) as vote_score
                FROM ai_models m
                LEFT JOIN rankings r ON m.model_id = r.model_id
                LEFT JOIN user_votes uv ON m.model_id = uv.model_id
            `;

            const values = [];
            if (category) {
                query += ` WHERE m.category = $1`;
                values.push(category);
            }

            query += `
                GROUP BY m.model_id, r.rank, r.score
                ORDER BY r.score DESC NULLS LAST
                LIMIT $${values.length + 1} OFFSET $${values.length + 2}
            `;
            values.push(limit, offset);

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching AI models: ${error.message}`);
        }
    }

    static async findById(modelId) {
        try {
            const query = `
                SELECT 
                    m.*,
                    r.rank,
                    r.score,
                    COUNT(DISTINCT uv.vote_id) as total_votes,
                    COALESCE(SUM(uv.vote), 0) as vote_score,
                    json_agg(DISTINCT ms.*) as statistics
                FROM ai_models m
                LEFT JOIN rankings r ON m.model_id = r.model_id
                LEFT JOIN user_votes uv ON m.model_id = uv.model_id
                LEFT JOIN model_statistics ms ON m.model_id = ms.model_id
                WHERE m.model_id = $1
                GROUP BY m.model_id, r.rank, r.score
            `;
            const result = await pool.query(query, [modelId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching AI model: ${error.message}`);
        }
    }

    static async update(modelId, { name, developer, release_date, description, category }) {
        try {
            const query = `
                UPDATE ai_models 
                SET 
                    name = COALESCE($1, name),
                    developer = COALESCE($2, developer),
                    release_date = COALESCE($3, release_date),
                    description = COALESCE($4, description),
                    category = COALESCE($5, category)
                WHERE model_id = $6
                RETURNING *
            `;
            const values = [name, developer, release_date, description, category, modelId];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating AI model: ${error.message}`);
        }
    }

    static async updateStatistics(modelId, { metric, value }) {
        try {
            const query = `
                INSERT INTO model_statistics (model_id, metric, value)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await pool.query(query, [modelId, metric, value]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating AI model statistics: ${error.message}`);
        }
    }

    static async updateRanking(modelId, { category, rank, score }) {
        try {
            // Primero verificamos si existe el modelo
            const modelExists = await pool.query(
                'SELECT model_id FROM ai_models WHERE model_id = $1',
                [modelId]
            );

            if (modelExists.rows.length === 0) {
                throw new Error('Modelo no encontrado');
            }

            // Luego actualizamos o insertamos el ranking
            const query = `
                INSERT INTO rankings (model_id, category, rank, score)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (model_id, category) 
                DO UPDATE SET rank = $3, score = $4, updated_at = CURRENT_TIMESTAMP
                RETURNING *
            `;
            const result = await pool.query(query, [modelId, category, rank, score]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating AI model ranking: ${error.message}`);
        }
    }

    static async vote(modelId, userId, voteValue) {
        try {
            // Verificar si existe el modelo
            const modelExists = await pool.query(
                'SELECT model_id FROM ai_models WHERE model_id = $1',
                [modelId]
            );

            if (modelExists.rows.length === 0) {
                throw new Error('Modelo no encontrado');
            }

            const query = `
                INSERT INTO user_votes (model_id, user_id, vote)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, model_id)
                DO UPDATE SET 
                    vote = EXCLUDED.vote,
                    voted_at = CURRENT_TIMESTAMP
                RETURNING *
            `;

            const result = await pool.query(query, [modelId, userId, voteValue]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error registering vote: ${error.message}`);
        }
    }
}

module.exports = AiModel; 