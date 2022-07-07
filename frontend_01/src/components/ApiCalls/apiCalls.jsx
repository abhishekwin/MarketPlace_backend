import axios from "axios";
import { useState } from "react";

export const createAuction =async (formData) => {
    console.log('formData',formData);
        axios({url: "http://localhost:5000/auctiondetails",
            method: "POST",
            headers: {
            },
            data: formData,
        }).then((res) => {
                console.log(res)
             })
            .catch((err) => { console.log(err)});


    }

   export const getAuctions = () => {
        axios
            .get("http://localhost:5000/auctiondetails/ ")
            .then(data => console.log(data.data))
            .catch(error => console.log(error));
 

}
export const getAuction = () => {
 
    axios
    .get("http://localhost:5000/auctiondetails/62b2bd95af06ec7108f74059 ")
    .then(data => console.log(data.data))
    .catch(error => console.log(error));
    



}
export const createFlatSale = () => {

}
const getFlatSale = () => {

}
const getOnSaleNft = () => {

}

    



