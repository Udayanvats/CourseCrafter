"use client";
import React, { useEffect, useState } from "react";

const Buildup = () => {
  const [scrollY, setScrollY] = useState(0);
  const [progressWidth1, setProgressWidth1] = useState(0);
  const [progressWidth2, setProgressWidth2] = useState(0);
  const [breakpoint, setBreakpoint] = useState(0); // New state variable for breakpoint

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = (window.scrollY / (docHeight - winHeight)) * 100;

      if (scrollPercent < 33.33) {
        setProgressWidth1(scrollPercent);
        setProgressWidth2(0);
        setBreakpoint(0);
      } else if (scrollPercent >= 33.33 && scrollPercent < 66.66) {
        setProgressWidth1(33.33);
        setProgressWidth2(scrollPercent - 33.33);
        if (progressWidth1 === 100) setBreakpoint(1);
      } else {
        setProgressWidth1(33.33);
        setProgressWidth2(66.66);
        if (progressWidth2 === 100) setBreakpoint(2);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div>
        <h1 className="font-bold text-white px-10 text-3xl text-center mb-10">
          Empower Students with Dynamic Learning Experiences
        </h1>
        <h3 className="text-center px-80 text-md text-gray font-semibold ">
          Revolutionize your study experience by effortlessly converting PPTs
          into interactive courses. Our intuitive platform streamlines the
          process, empowering active learning and unlocking academic potential.
        </h3>
      </div>
      <div className="border border-white b-2 ">
        <div className="px-16 mt-6 ">
          <div className="flex justify-between items-center text-white text-2xl font-bold">
            <span>Build</span>
            <div className="relative h-2 w-full bg-gray-500 rounded-full mx-4">
              <div
                className="absolute h-2 bg-white rounded-full progress-bar"
                style={{ width: `${progressWidth1}%` }}
              ></div>
            </div>
            <span>Fortify</span>
            <div className="relative h-2 w-full bg-gray-500 rounded-full mx-4">
              <div
                className="absolute h-2 bg-white rounded-full progress-bar"
                style={{ width: `${progressWidth2}%` }}
              ></div>
            </div>
            <span>Grow</span>
          </div>
        </div>
      </div>
      <div>
        <p>Current Breakpoint: {breakpoint}</p>
      </div>
    </div>
  );
};

export default Buildup;
