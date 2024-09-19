import React, { useState } from 'react'
import {navLinks} from '../constants/index.js'

const NavItems=()=>{
  return (
    //  1. we can create home about work like this also but it is too much repetitive.
    //  <ul className="nav-ul">
    //   <li className='nav-li'>
    //     <a href="/" className='nav-li_a'>Home</a>
    //   </li>
    //  </ul>

    // 2. other way to create home work project on nav bar
    // <ul className='nav-ul'>
    //   {['Home','About','Projects','Contact'].map((item,index)=>(
    //     <li key={index} className='nav-li'><a href='/' className='nav-li_a' >{item} </a></li>
    //   ))}
    // </ul> 

    //3.Dynamically add nav section from constant folder with the help of id.
      <ul className='nav-ul'>
        {navLinks.map(({id,href,name})=>(
          <li key={id} className='nav-li' >
            <a href={href} className='nav-li_a' onClick={()=>{}} >
              {name}</a>

        </li>
      ))}

      </ul>
    
  )
}

const Navbar = () => {
  const [isOpen,setIsOpen] =useState(false)

  const toggleMenu=()=>{
    setIsOpen( (prevIsOpen) => !prevIsOpen)
  }
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-black/90'>
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center py-5 mx-auto c-space  ">

        <a href="/" className='text-neutral-400 font-bold text-xl
         hover:text-white transition-colors'>
        Gaurav
        </a>

        <button onClick={toggleMenu} className="text-neutral-400
         hover:text-white focus:outline-none sm:hidden  flex" aria-label='Toggle menu' > 
          <img src={isOpen ? "assets/close.svg": "assets/menu.svg"}
           alt="toggle" className='w-6 h-6 '/>
        </button>

        <nav className='sm:flex hidden'>
          <NavItems/>

        </nav>

      </div>

    </div>

    // This section is for mobile navbar.
    <div className={`nav-sidebar ${isOpen ? 'max-h-screen': 'max-h-0'}`}>
      <nav className='p-5'>
          <NavItems/>
          </nav>
    </div>
      
    </header>
  )
}

export default Navbar
