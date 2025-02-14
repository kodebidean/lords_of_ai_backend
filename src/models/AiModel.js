const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const logger = require('../utils/logger');

class AiModel extends Model {
    static async create({ name, developer, release_date, description, category }) {
        try {
            const query = `
                INSERT INTO ai_models (name, developer, release_date, description, category)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const values = [name, developer, release_date, description, category];
            const result = await sequelize.query(query, { replacements: values });
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating AI model: ${error.message}`);
        }
    }

    static async findAll(options = {}) {
        try {
            const query = `
                SELECT 
                    m.model_id,
                    m.name,
                    m.description,
                    m.developer,
                    m.release_date,
                    m.website_url,
                    m.documentation_url,
                    m.version,
                    c.category_id,
                    c.name as category_name,
                    c.description as category_description,
                    COALESCE(AVG(mv.score), 0) as score,
                    COUNT(DISTINCT mv.vote_id) as total_votes
                FROM ai_models m
                LEFT JOIN categories c ON m.category_id = c.category_id
                LEFT JOIN model_votes mv ON m.model_id = mv.model_id
                GROUP BY 
                    m.model_id,
                    m.name,
                    m.description,
                    m.developer,
                    m.release_date,
                    m.website_url,
                    m.documentation_url,
                    m.version,
                    c.category_id,
                    c.name,
                    c.description
                ORDER BY score DESC
            `;

            const [results] = await sequelize.query(query);
            
            return results.map(model => ({
                model_id: model.model_id,
                name: model.name,
                description: model.description,
                developer: model.developer,
                release_date: model.release_date,
                website_url: model.website_url,
                documentation_url: model.documentation_url,
                version: model.version,
                score: parseFloat(model.score),
                total_votes: parseInt(model.total_votes),
                category: {
                    category_id: model.category_id,
                    category_name: model.category_name,
                    description: model.category_description
                }
            }));
        } catch (error) {
            console.error('Error en AiModel.findAll:', error);
            throw new Error(`Error fetching AI models: ${error.message}`);
        }
    }

    static async findById(modelId) {
        try {
            const query = `
                SELECT 
                    m.*,
                    c.category_name,
                    c.icon_url as category_icon,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', mc.characteristic_id,
                                'name', mc.characteristic_name,
                                'value', mc.value,
                                'category', cc.name,
                                'unit', cc.unit_of_measure,
                                'confidence', mc.confidence_level
                            )
                        )
                        FROM model_characteristics mc
                        JOIN characteristic_categories cc ON mc.category_id = cc.category_id
                        WHERE mc.model_id = m.model_id
                    ) as characteristics,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'version', mv.version_number,
                                'date', mv.release_date,
                                'changes', mv.changes_description,
                                'is_major', mv.is_major_update
                            )
                        )
                        FROM model_versions mv
                        WHERE mv.model_id = m.model_id
                        ORDER BY mv.release_date DESC
                    ) as versions,
                    (
                        SELECT json_agg(
                            json_build_object(
                                'benchmark', b.name,
                                'score', br.score,
                                'date', br.test_date
                            )
                        )
                        FROM benchmark_results br
                        JOIN benchmarks b ON br.benchmark_id = b.benchmark_id
                        WHERE br.model_id = m.model_id
                        ORDER BY br.test_date DESC
                    ) as benchmark_results
                FROM ai_models m
                LEFT JOIN categories c ON m.category_id = c.category_id
                WHERE m.model_id = $1
            `;

            const result = await sequelize.query(query, { replacements: [modelId] });
            return result.rows[0];
        } catch (error) {
            logger.error('Error en AiModel.findById:', error);
            throw new Error(`Error fetching AI model: ${error.message}`);
        }
    }

    static async update(id, modelData) {
        try {
            const { name, developer, category_id, description, release_date } = modelData;
            const query = `
                UPDATE ai_models 
                SET name = $1, 
                    developer = $2, 
                    category_id = $3, 
                    description = $4, 
                    release_date = $5,
                    updated_at = CURRENT_TIMESTAMP
                WHERE model_id = $6 
                RETURNING *
            `;
            const values = [name, developer, category_id, description, release_date, id];
            const result = await sequelize.query(query, { replacements: values });
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating AI model: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            // Primero eliminamos las referencias en otras tablas
            await sequelize.query('DELETE FROM model_characteristics WHERE model_id = $1', { replacements: [id] });
            await sequelize.query('DELETE FROM score_history WHERE model_id = $1', { replacements: [id] });
            await sequelize.query('DELETE FROM user_votes WHERE model_id = $1', { replacements: [id] });
            
            // Finalmente eliminamos el modelo
            const query = 'DELETE FROM ai_models WHERE model_id = $1';
            await sequelize.query(query, { replacements: [id] });
            return true;
        } catch (error) {
            throw new Error(`Error deleting AI model: ${error.message}`);
        }
    }

    static async updateStatistics(modelId, { metric, value }) {
        try {
            const query = `
                INSERT INTO model_statistics (model_id, metric, value)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await sequelize.query(query, { replacements: [modelId, metric, value] });
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating AI model statistics: ${error.message}`);
        }
    }

    static async updateRanking(modelId, { category, rank, score }) {
        try {
            // Primero verificamos si existe el modelo
            const modelExists = await sequelize.query(
                'SELECT model_id FROM ai_models WHERE model_id = $1',
                { replacements: [modelId] }
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
            const result = await sequelize.query(query, { replacements: [modelId, category, rank, score] });
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating AI model ranking: ${error.message}`);
        }
    }

    static async vote(modelId, userId, voteValue) {
        try {
            // Verificar si existe el modelo
            const modelExists = await sequelize.query(
                'SELECT model_id FROM ai_models WHERE model_id = $1',
                { replacements: [modelId] }
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

            const result = await sequelize.query(query, { replacements: [modelId, userId, voteValue] });
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error registering vote: ${error.message}`);
        }
    }

    static async getModelMetrics(modelId) {
        try {
            const query = `
                SELECT characteristic_name, value
                FROM model_characteristics
                WHERE model_id = $1
                ORDER BY characteristic_name
            `;
            const result = await sequelize.query(query, { replacements: [modelId] });
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching model metrics: ${error.message}`);
        }
    }

    static async voteModel(modelId, voteType) {
        try {
            const query = `
                UPDATE ai_models
                SET ${voteType === 'like' ? 'likes = likes + 1' : 'dislikes = dislikes + 1'}
                WHERE model_id = $1
                RETURNING *
            `;
            const result = await sequelize.query(query, { replacements: [modelId] });
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error voting model: ${error.message}`);
        }
    }
}

AiModel.init({
    model_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    developer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    website_url: {
        type: DataTypes.STRING
    },
    documentation_url: {
        type: DataTypes.STRING
    },
    version: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'category_id'
        }
    }
}, {
    sequelize,
    modelName: 'AiModel',
    tableName: 'ai_models',
    timestamps: true,
    underscored: true
});

module.exports = AiModel; 