"use client";
import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Introduction to Web Development</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Present
          </button>
          <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Download
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
