const mongoose = require('mongoose');
const flateSaleSchema = require('../model/FlateSale.Schema');
require('express');

exports.create_flate_sale = async function(req,resp){
    const data = new flateSaleSchema(req.body);
    const result = await data.save();
    resp.send(result);
};

exports.get_flate_sale = async function(req,resp){
    const data = await flateSaleSchema.find();
    resp.send(data);
};

exports.delete_flat_sale = async function(req,resp){
    const data = await flateSaleSchema.deleteOne(req.params);
    resp.send(data);
};

exports.update_flat_sale = async function(req,resp){
    console.log(req.params);
    const data = await flateSaleSchema.updateOne(
        req.params,
        {
            $set:req.body
        }
    );
    resp.send(data);
}

