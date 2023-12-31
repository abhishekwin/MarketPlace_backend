const mongoose = require('mongoose');

1
const bidderDetailSchema = new mongoose.Schema({

    start_time:{
        type : String, 
        default: Date,
    },
    end_time:{
        type:String,
        default: Date,
    },
    starting_amount:{
        type:Number,
    },
    reserve_amount:{
        type:Number,
    },
    decline_amount:{
        type:Number,
    },
    uri:{
        type:String,
    },
    to_address:{
        type:String,
    },
    royalty:{
        type:Number,
    },
    nonce:{
        type:Number,
    }
});

const use = mongoose.model('BidderDetailSchema',bidderDetailSchema);
module.exports = use;

