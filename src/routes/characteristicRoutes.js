const express = require('express');
const router = express.Router();
const CharacteristicController = require('../controllers/characteristicController');

router.get('/', CharacteristicController.getCharacteristics);
router.get('/:id', CharacteristicController.getCharacteristicById);
router.post('/', CharacteristicController.createCharacteristic);
router.put('/:id', CharacteristicController.updateCharacteristic);
router.delete('/:id', CharacteristicController.deleteCharacteristic);

module.exports = router; 