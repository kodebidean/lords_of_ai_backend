const Category = require('../models/Category');
const logger = require('../utils/logger');

class CategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            logger.error('Error en getCategories:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener categorías'
            });
        }
    }

    static async getCategoryHierarchy(req, res) {
        try {
            const hierarchy = await Category.getHierarchy();
            res.json({
                success: true,
                data: hierarchy
            });
        } catch (error) {
            logger.error('Error en getCategoryHierarchy:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener jerarquía de categorías'
            });
        }
    }
}

module.exports = CategoryController; 