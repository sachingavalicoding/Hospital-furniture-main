// src/components/Navbar.js
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   console.log(isSidebarOpen)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="bg-gray-800 py-4 px-14  top-0 sticky  left-0 w-full z-10 ">
      <div className="flex items-center justify-between w-full">
        <Link to={"/"}> 
        <img className='w-24' src="/assets/logo.png" alt="logo" />
        </Link>
        <button
          className="text-white focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <nav className='hidden md:block  '>
              <ul className='flex items-center gap-16'>
                <li>
                  <Link
                    to="/"
                    className="text-white hover:text-gray-300"
                    onClick={closeSidebar}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-white hover:text-gray-300"
                    onClick={closeSidebar}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-white hover:text-gray-300"
                    onClick={closeSidebar}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white hover:text-gray-300"
                    onClick={closeSidebar}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
      </div>

      {
        isSidebarOpen ? (
            <div className="bg-gray-800 w-full pt-3 text-center md:w-96 fixed h-full top-20rem right-0 transition-all duration-700 transform translate-y-0">
            <div className="p-4">
              <p className="text-white mb-4"> Our Services </p>
              <nav>
                <ul className='flex flex-col gap-8 mt-10'>
                  <li>
                    <Link
                      to="/"
                      className="text-white hover:text-gray-300"
                      onClick={closeSidebar}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="text-white hover:text-gray-300"
                      onClick={closeSidebar}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-white hover:text-gray-300"
                      onClick={closeSidebar}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-white hover:text-gray-300"
                      onClick={closeSidebar}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        ): <div> </div>
      }
    </div>
  );
};

export default Navbar;
