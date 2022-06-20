const express = require('express');
const router = express.Router();

const FlateSaleController = require('../controllers/FlateSaleController');

router.post('/', FlateSaleController.create_flate_sale);
router.get('/', FlateSaleController.get_flate_sale);
router.delete('/:_id', FlateSaleController.delete_flat_sale);
router.put('/:_id', FlateSaleController.update_flat_sale);

module.exports = router;