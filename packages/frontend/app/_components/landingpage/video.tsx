"use client";
import React from "react";
import VideoComponent from "./device";
// import Device from "./device";

const Video = () => {
  return (
    <div className="py-16 bg-black-950 mt-10" id="usage">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 text-shadow-lg">
          Explore the functionalities of CourseCrafter
        </h1>
        <VideoComponent />
        {/* <Device/> */}
      </div>
    </div>
  );
};

export default Video;
