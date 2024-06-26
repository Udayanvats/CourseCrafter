import AuthComponent from "@/app/_components/login";
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
          <AuthComponent/>

          </div>
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
