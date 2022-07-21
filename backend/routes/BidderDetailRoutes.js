const express = require('express');

const router = express.Router();

const BidderController = require('../controllers/BidderDetailController');

router.post('/',BidderController.create_post);

router.get('/', BidderController.get_posts);

router.delete('/:_id', BidderController.delete_posts);

router.put('/:_id', BidderController.put_post);

module.exports = router;