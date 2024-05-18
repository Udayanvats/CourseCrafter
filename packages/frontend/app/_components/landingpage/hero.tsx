"use client";
import React, { useState, useEffect } from "react";

const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Unlock learning with",
    "Transform with",
    "Study Smarter with",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="max-w-3xl mx-auto p-4">
        <h1
          className="relative z-10 text-center text-white text-6xl font-bold transition-opacity duration-500"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          {texts[textIndex]}{" "}
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text transition-opacity duration-500">
            AI
          </span>
        </h1>
        <p className="text-gray max-w-2xl mx-auto my-4 text-xl text-center font-semibold relative z-10">
          Effortlessly Convert Presentations into Interactive Study Guides
        </p>
      </div>
    </section>
  );
};

export default Hero;
