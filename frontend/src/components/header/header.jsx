import React from 'react'
import '/Users/dr.mac/Desktop/blockchainproject/Marketplace/frontend/src/components/Header/Header.css'
import {Container} from 'reactstrap';
import { NavLink, Link} from 'react-router-dom';
import { useRef, useEffect } from 'react';

const NAV__LINKS = [
  {
    display:'Home',
    url:'/home '
  },
  {
    display:'Market',
    url:'/market '
  },
  {
    display:'Create',
    url:'/create '
  },
  {
    display:'Contact',
    url:'/contact '
  },
  {
    display:'Wallet',
    url:'/wallet '
  },
]

const Header = () => {

  const headerRef = useRef(null);

  const menuRef = useRef(null);

  const toggleMenu = () => menuRef.current.classList.toggle('active__menu');

  return <header className="header">
    <Container>
      <div className="navigation"> 
        <div className="logo">
          <Link to='/home'><h2 className='d-flex gap-2 align-items-center'>
            <span><i class="ri-store-2-fill"></i></span> NFT Marketplace
          </h2>
          </Link>
        </div>

        <div className="nav__right d-flex align-items-center gap-5">
          <button className="btn d-flex align-items-center gap-2">
            <Link to='/wallet'><span><i class="ri-wallet-2-line"></i></span>Connect Wallet</Link>
          </button>
          <div>
          <span className="mobile__menu"><i class="ri-menu-2-line" onClick={toggleMenu}></i></span>
          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
           <ul className="nav__list">

              {
                NAV__LINKS.map((item, index)=> (<li className='nav__item' key={index}>
                  <NavLink to={item.url} className={(navClass)=> navClass.isActive ? 'active' : ''}>{item.display}</NavLink>
                </li>
                ))}
              
           </ul>
        </div>
          </div>
          
        </div>
      </div>
    </Container>
  </header>
}

export default Header