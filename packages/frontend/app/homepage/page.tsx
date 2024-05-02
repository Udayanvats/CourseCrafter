"use client";
import React from "react";
import Link from "next/link"; // Import Link from Next.js
import Button from "../_components/button";
import Upload from "./upload";

const Homepage = () => {
  function handleUpload(files: File[]): void {
    console.log(files);
  }

  return (
    <div className="w-screen h-screen py-12 md:py-24 lg:py-40 bg-white flex justify-center items-center">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4 pl-4">
          <h1 className="text-3xl font-bold tracking-tighter text-black  sm:text-4xl md:text-5xl">
            Create a Course from Your PowerPoint Slides
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Easily transform your PowerPoint presentations into engaging online
            courses. Upload your slides and let us handle the rest.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button
              text="Upload PPTs"
              padding="5px"
              backgroundColor="blue"
              color="white"
            />
            <Button
              text="Learn More"
              padding="5px"
              backgroundColor="white"
              color="black"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-gray-100  rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Upload Your PPTs
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Drag and drop your PowerPoint slides or click to upload. We'll
              handle the rest.
            </p>
            <div className="flex justify-center text-black">
              <h1>Upload PPTs</h1>
            </div>
            <div className="mt-6">
              <Upload onUpload={handleUpload} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
