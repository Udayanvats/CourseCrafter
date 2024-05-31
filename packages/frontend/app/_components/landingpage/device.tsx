"use client";

import React, { useState } from "react";

const VideoComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative w-[80%] h-[80%] lg:w-[60%] lg:h-[60%]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-2xl focus:outline-none"
            >
              &#x2715;
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/eI4an8aSsgw"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <div
        className="relative w-[45rem] h-[45rem] shadow-md cursor-pointer"
        onClick={openModal}
      >
        <div className="absolute inset-0 border-8 border-slate rounded-3xl"></div>
        <div className="absolute inset-8 border-8 border-slate rounded-3xl px-1">
          <iframe
            className="h-full w-full rounded-md"
            src="https://www.youtube.com/embed/eI4an8aSsgw"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
