const express = require('express');
const mongoose = require('mongoose');

const AuctionRoute = require('./routes/AuctionDetailsRoutes');
const BidderRoute = require('./routes/BidderDetailRoutes');
const FlateSaleRout = require('./routes/FlateSaleRoute');

const app = express();
app.use(express.json());
require('./model/db');

app.use('/auctiondetails',AuctionRoute);
app.use('/bidderdetails', BidderRoute);
app.use('/flatesale', FlateSaleRout);

app.listen(3000);
