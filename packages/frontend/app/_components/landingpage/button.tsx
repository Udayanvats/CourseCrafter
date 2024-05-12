"use client";
import React from "react";

const GetStartedButton = () => {
  return (
    <button
      onClick={() => {
        console.log("clicked");
      }}
      className=" z-10 p-[3px] relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        Get Started
      </div>
    </button>
  );
};

export default GetStartedButton;
