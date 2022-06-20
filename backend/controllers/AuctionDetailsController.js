const mongoose = require('mongoose');
const AuctionDetailsSchema = require('../model/AuctionDetailsSchema');
const express = require('express');


exports.create_post = async function(req,resp){
    const data = new AuctionDetailsSchema(req.body);
    const result  = await data.save();
    console.log(req.body);
    resp.send(result);
};


exports.get_post = async function(req,resp){

    const data = await AuctionDetailsSchema.find();
    resp.send(data);
};


    exports.delete_post = async function(req,resp){
        console.log(req.params);
        const data  = await AuctionDetailsSchema.deleteOne(req.params);
        resp.send(data);
    };


exports.put_post = async function(req,resp){
    console.log(req.params);
    const data = await AuctionDetailsSchema.updateOne(
        req.params,
        {
            $set:req.body
        }
    );
    resp.send(data);
};

