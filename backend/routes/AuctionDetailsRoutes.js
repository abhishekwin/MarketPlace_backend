const express = require('express');

const router = express.Router();

const AuctionController = require('../controllers/AuctionDetailsController');

router.post('/', AuctionController.create_post);

router.get('/', AuctionController.get_post);
router.delete('/:_id', AuctionController.delete_post);
router.put('/:_id', AuctionController.put_post);

module.exports = router;
