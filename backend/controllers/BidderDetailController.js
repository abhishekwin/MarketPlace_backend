const mongoose = require('mongoose');
const bidderDetailSchema = require('../model/BidderDetailSchema');
const express = require('express');

// const app = express();
// app.use(express.json());

// app.post("/createbidder",async (req,resp)=>{
//     const data = new bidderDetailSchema(req.body);
//     const result = await data.save();
//     console.log(req.body);
//     resp.send(result);
// });

exports.create_post = async function(req,resp){
    const data = new bidderDetailSchema(req.body);
    const result = await data.save();
    console.log(req.body);
    resp.send(result);
};

// app.get("/bidderlist",async(req,resp)=>{

//     const data = await bidderDetailSchema.find();
//     resp.send(data);
// });

exports.get_posts = async function(req,resp){

    const data = await bidderDetailSchema.find();
    resp.send(data);
};

// app.delete("/deletebidder/:_id",async(req,resp)=>{
//     console.log(req.params);
//     const data = await bidderDetailSchema.deleteOne(req.params);
//     resp.send(data);
// });

exports.delete_posts = async function(req,resp){

    console.log(req.params);
    const data = await bidderDetailSchema.deleteOne(req.params);
    resp.send(data);
}

// app.put("/updatebidder/:_id",async(req,resp)=>{
//     console.log(req.params);
//     const data = await bidderDetailSchema.updateOne(
//         req.params,
//         {
//             $set: req.body
//         }
//     );
//     resp.send(data);
// });

exports.put_post = async function(req,resp){
    console.log(req.params);
    const data = await bidderDetailSchema.updateOne(
        req.params,
        {
            $set:req.body
        }
    );
    resp.send(data);
};

