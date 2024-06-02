import Link from "next/link";
import React from "react";
import AuthComponent from "./login";

const Navbar = () => {
  return (
    <nav className=" relative  w-full z-50  py-4 border-gray-300 shadow-md dark:bg-gray-900 dark:border-gray-700 dark:shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href={"/"} className="font-bold text-xl text-white">
            COURSECRAFTER
          </Link>
          <ul className=" z-10 flex items-center space-x-8 ml-8">
            <li>
            <Link
              scroll={true}
                href="#features-section"
                className="text-gray-900 hover:text-blue-700 text-white dark:hover:text-blue-500 hover:underline"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
              scroll={true}
                href="#usage"
                className="text-gray-900 hover:text-blue-700 text-white dark:hover:text-blue-500 hover:underline"
              >
                How to use
              </Link>
            </li>
            <li>
            <Link
              scroll={true}
                href="#aboutus"
                className="text-gray-900 hover:text-blue-700 text-white dark:hover:text-blue-500 hover:underline"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex ">
          <div className="px-2">
          <AuthComponent/>
          </div>
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
