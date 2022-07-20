import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';

import Home from '../pages/Home';
import Market from '../pages/Market';
import Wallet from '../pages/Wallet';
import Contact from '../pages/Contact';
import Create from '../pages/Create';
 
const Routers  = () => {
  return <Routes>
    <Route path='/' element={<Navigate to='home'/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/market' element={<Market/>}/>
    <Route path='/wallet' element={<Wallet/>}/>
    <Route path='/contact' element={<Contact/>}/>
    <Route path='/create' element={<Create/>}/>




  </Routes>
}

export default  Routers;