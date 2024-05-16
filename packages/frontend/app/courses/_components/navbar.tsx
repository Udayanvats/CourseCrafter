import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-background  py-4 border-gray-300 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:shadow-lg">
      <div className="   flex  items-center justify-between">
      <Link href={"/"} className="font-bold text-xl text-white ml-7">COURSECRAFTER</Link>
        {/* <div className="flex items-center">
         
          <ul className=" z-10 flex items-center space-x-8 ml-8">
            <li>
              <a
                href="#features-section"
                className="text-gray-900 hover:text-blue-700 text-white dark:hover:text-blue-500 hover:underline"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#usage"
                className="text-gray-900 hover:text-blue-700 text-white dark:hover:text-blue-500 hover:underline"
              >
                How to use
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-900 hover:text-blue-700 text-white dark:hover:text-blue-500 hover:underline"
              >
                About Us
              </a>
            </li>
          </ul>
        </div> */}
        <div className="flex ">
          <div className="px-2">
            <button className="z-10 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 p-3 px-4 hover:opacity-70 transition-all duration-200">
                Login
            </button>
          </div>
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
