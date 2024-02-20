// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black w-full text-white py-8 mt-16 text-center">
      <div className="container mx-auto grid grid-cols-1 gap-6 items-center justify-between lg:grid-cols-2">
        <div className="text-center ">
          <p className="font-bold text-lg"> Sree Jagadamba Production </p>
          <p className="text-sm">
            S. No.32.Behind Angaraj Dhaba Yeolewadi road Kondhwa (BK) pune
            411048
          </p>
        </div>

        {/* <div className=" ">
          <h3 className="text-lg font-bold mb-2">Quick Links</h3>
          <ul className="list-none p-0 flex gap-3 text-center flex-col">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div> */}

        <div className="w-full grid grid-cols-1 items-center  gap-5 justify-center  sm:grid-cols-2">
          <div className="w-full flex flex-col items- center stify-center">
            <h3 className="text-lg font-bold mb-2">Connect With Us</h3>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="#"
                className="icon-link hover:translate-y-[-3px] transform transition-transform duration-300"
              >
                <FaTwitter size={24} />
              </Link>
              <Link
                to="https://www.instagram.com/shree_jagadamba_production/?igsh=ZHhpdmt6Mm1leWVp"
                className="icon-link hover:translate-y-[-3px] transform transition-transform duration-300"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                to="#"
                className="icon-link hover:translate-y-[-3px] transform transition-transform duration-300"
              >
                <FaLinkedin size={24} />
              </Link>
              <Link
                to="https://www.facebook.com/people/Mayur-Wagh/pfbid02NpBK1EjKquVdGfkvH5V8oAuHAjrwjh88vBQ6CL5ujEeMMf5Hj28pfnABqv23howql/"
                className="icon-link hover:translate-y-[-3px] transform transition-transform duration-300"
              >
                <FaFacebook size={24} />
              </Link>
            </div>
          </div>

          <div className="">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p className="text-sm">shreejagadambaproduction2003@gmail.com</p>
            <p className="text-sm">Phone: +91 8830277269</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
