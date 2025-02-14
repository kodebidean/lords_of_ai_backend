const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { validateToken } = require('../middleware/auth');

// Rutas públicas
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

// Rutas protegidas
router.post('/', validateToken, CategoryController.createCategory);
router.put('/:id', validateToken, CategoryController.updateCategory);
router.delete('/:id', validateToken, CategoryController.deleteCategory);

module.exports = router; 