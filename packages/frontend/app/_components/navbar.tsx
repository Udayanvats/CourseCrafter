"use client";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b-2 py-4 border-gray-300 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <p className="font-bold text-xl text-black">COURSECRAFTER</p>
          <ul className=" z-10 flex items-center space-x-8 ml-8">
            <li>
              <a
                href="#features-section"
                className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 hover:underline"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#usage"
                className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 hover:underline"
              >
                How to use
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 hover:underline"
              >
                About Us
              </a>
            </li>
          </ul>
        </div>
        <div className="flex ">
          <div className="px-2">
            <button className="z-10 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Login
              </span>
            </button>
          </div>
          <button className="z-10 px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
