"use client";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import StickyBox from "react-sticky-box";
import UploadContent from "../buildupContent/upload";
import ConvertContent from "../buildupContent/convert";

const Buildup = () => {
  const [scrollY, setScrollY] = useState(0);
  const [progressWidth1, setProgressWidth1] = useState(0);
  const [progressWidth2, setProgressWidth2] = useState(0);
  const [breakpoint, setBreakpoint] = useState(0);
  const containerRef = useRef(null); // New ref for container

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const winHeight = 2000;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = ((window.scrollY-1000)/2000)*100;
      console.log(((window.scrollY-1000)/2000)*100)
      const containerWidth = containerRef.current ? containerRef?.current?.clientWidth+1300 : 0;
      console.log(containerWidth,"container")
      if(scrollPercent<0){
      }
      if (scrollPercent < 33.333333333333) {
        console.log((scrollPercent/100)*containerWidth)
        setProgressWidth1((scrollPercent / 100) * containerWidth);
        setProgressWidth2(0);
        setBreakpoint(0);
      } else if (scrollPercent >= 33.33 && scrollPercent < 66.66) {
        setProgressWidth1((33.33 / 100) * containerWidth);
        setProgressWidth2(((scrollPercent - 33.33) / 100) * containerWidth);
        setBreakpoint(1);
      } else {
        setProgressWidth1((33.33 / 100) * containerWidth);
        setProgressWidth2((33.33 / 100) * containerWidth);
        setBreakpoint(2);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
      <div className="row h-[2500px]">
        <StickyBox offsetTop={20} offsetBottom={20}>
          <div>
            <h1 className="font-bold text-white px-10 text-3xl text-center mb-10">
              Empower Students with Dynamic Learning Experiences
            </h1>
            <h3 className="text-center px-80 text-md text-gray font-semibold">
              Revolutionize your study experience by effortlessly converting PPTs
              into interactive courses. Our intuitive platform streamlines the
              process, empowering active learning and unlocking academic potential.
            </h3>
          </div>
          <div className="border border-white b-2">
            <div className="px-16 mt-6" >
              <div className="flex justify-between items-center text-white text-2xl font-bold">
                <span>Build</span>
                <div id="build" ref={containerRef} className="relative h-2 w-full bg-red-500 rounded-full mx-4">
                  <div
                    className="absolute h-2 bg-white rounded-full progress-bar"
                    style={{ width: `${progressWidth1}px` }}
                  ></div>
                </div>
                <span>Fortify</span>
                <div className="relative h-2 w-full bg-gray-500 rounded-full mx-4">
                  <div
                    className="absolute h-2 bg-white rounded-full progress-bar"
                    style={{ width: `${progressWidth2}px` }}
                  ></div>
                </div>
                <span>Grow</span>
              </div>
            </div>
          </div>
          <div className="w-full">
            <AnimatePresence mode="wait">
              {
                breakpoint === 0
                  ?
                  <UploadContent />
                  :
                  breakpoint === 1
                    ?
                    <ConvertContent />
                    :
                    <UploadContent />


              }

            </AnimatePresence>

          </div>
        </StickyBox>
      </div>
  );
};

export default Buildup;
