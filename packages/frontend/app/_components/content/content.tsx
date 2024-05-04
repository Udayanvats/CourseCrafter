"use client";
import React from "react";
import Rectanglecontent from "../skeleton/rectanglecontent";
interface ContentProps {
  isLoading: boolean;
}
const MainContent = ({ isLoading }: ContentProps) => {
  return { isLoading } ? (
    <div className="p-12">
      <Rectanglecontent />
    </div>
  ) : (
    <div className="w-2/3 p-6">
      {/* <img
          alt="Presentation Slide"
          className="w-full h-auto rounded-t-lg"
          height="600"
          src="/placeholder.svg"
          style={{
            aspectRatio: "800/600",
            objectFit: "cover",
          }}
          width="800"
        /> */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">HTML Basics</h2>
        <p className="text-gray-600 leading-relaxed">
          In this section, we'll cover the fundamental building blocks of web
          pages: HTML elements, tags, and structure. You'll learn how to create
          basic web pages with headings, paragraphs, links, and images.
        </p>
      </div>
    </div>
  );
};

export default MainContent;
