const pool = require('../config/database');
const logger = require('../utils/logger');

class Category {
    static async findAll() {
        try {
            const query = `
                SELECT 
                    c.*,
                    p.category_name as parent_category_name,
                    COUNT(m.model_id) as model_count
                FROM categories c
                LEFT JOIN categories p ON c.parent_category_id = p.category_id
                LEFT JOIN ai_models m ON c.category_id = m.category_id
                GROUP BY c.category_id, p.category_name
                ORDER BY c.category_level, c.category_name
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            logger.error('Error en Category.findAll:', error);
            throw error;
        }
    }

    static async getHierarchy() {
        try {
            const query = `
                WITH RECURSIVE category_tree AS (
                    SELECT 
                        category_id, 
                        category_name,
                        parent_category_id,
                        category_level,
                        ARRAY[category_name] as path
                    FROM categories
                    WHERE parent_category_id IS NULL
                    
                    UNION ALL
                    
                    SELECT 
                        c.category_id,
                        c.category_name,
                        c.parent_category_id,
                        c.category_level,
                        ct.path || c.category_name
                    FROM categories c
                    INNER JOIN category_tree ct ON ct.category_id = c.parent_category_id
                )
                SELECT * FROM category_tree ORDER BY path;
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            logger.error('Error en Category.getHierarchy:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const query = 'SELECT * FROM categories WHERE category_id = $1';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching category: ${error.message}`);
        }
    }
}

module.exports = Category; 