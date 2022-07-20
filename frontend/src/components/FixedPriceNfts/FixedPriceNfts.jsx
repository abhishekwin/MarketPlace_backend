import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { getFlateSale } from "../ApiCalls/FixedPriceApi";
import Gallary from 'react-bootstrap'
import NftForm from "../NftForm/NftForm";
import {Carousel} from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import '../FixedPriceNfts/FixedPriceNfts.css'


const FixedPriceNfts = () => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    getNFTs();
  },[]);

  const getNFTs = async () =>{
    

    const data = await getFlateSale();
    console.log("Data in FixedPriceNFTs", data.data);
    // debugger
    const res = data.data;
    setFormData(res)
  }


  

  return(

    <div className="nfts">
      <h2>Explore</h2>

    <Carousel>
{
  formData.map((item)=>(
    <>
    {/* Name : {item?.nft__name}  <br/>
    <img src={item.uri} alt="" /> */}
    <div className="slide_item">
      <img src={item?.uri} alt="" />
      <p>{item?.nft__name}</p>
      <br/>
    </div>
    </>
  ))
}
</Carousel>
    </div>
  ) 
  
  
};

export default FixedPriceNfts;
