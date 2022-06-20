const mongoose = require('mongoose');

const flateSaleSchema = new mongoose.Schema({

    token_id:{
        type:Number,
    },
    nft_address:{
        type:String,
    },
    seller_address:{
        type:String,
    },
    collection_address:{
        type:String,
    },
    sale_amount:{
        type:Number,
    },
    time_limit:{
        type:Date,
    },
    payment_asset_address:{
        type:String,
    },
    nonce:{
        type:String,
    }


});


const use = mongoose.model('FlateSale',flateSaleSchema);

module.exports = use;