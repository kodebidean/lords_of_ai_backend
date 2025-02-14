const pool = require('../config/database');
const logger = require('../utils/logger');

class ModelCharacteristic {
    static async findByModel(modelId) {
        try {
            const query = `
                SELECT 
                    mc.*,
                    cc.name as category_name,
                    cc.unit_of_measure
                FROM model_characteristics mc
                JOIN characteristic_categories cc ON mc.category_id = cc.category_id
                WHERE mc.model_id = $1
                ORDER BY cc.name, mc.characteristic_name
            `;
            
            const result = await pool.query(query, [modelId]);
            return result.rows;
        } catch (error) {
            logger.error('Error en ModelCharacteristic.findByModel:', error);
            throw error;
        }
    }

    static async add(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertQuery = `
                INSERT INTO model_characteristics 
                (model_id, category_id, characteristic_name, value, confidence_level, measurement_method, source_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;

            const result = await client.query(insertQuery, [
                data.model_id,
                data.category_id,
                data.characteristic_name,
                data.value,
                data.confidence_level,
                data.measurement_method,
                data.source_url
            ]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error en ModelCharacteristic.add:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, data) {
        try {
            const query = `
                UPDATE model_characteristics
                SET 
                    value = $1,
                    confidence_level = $2,
                    measurement_method = $3,
                    source_url = $4,
                    measurement_date = CURRENT_TIMESTAMP
                WHERE characteristic_id = $5
                RETURNING *
            `;

            const result = await pool.query(query, [
                data.value,
                data.confidence_level,
                data.measurement_method,
                data.source_url,
                id
            ]);

            return result.rows[0];
        } catch (error) {
            logger.error('Error en ModelCharacteristic.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const query = 'DELETE FROM model_characteristics WHERE characteristic_id = $1';
            await pool.query(query, [id]);
            return true;
        } catch (error) {
            throw new Error(`Error deleting model characteristic: ${error.message}`);
        }
    }
}

module.exports = ModelCharacteristic; 