"use client";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import StickyBox from "react-sticky-box";
import UploadContent from "../buildupContent/upload";
import ConvertContent from "../buildupContent/convert";
import StudyContent from "../buildupContent/study";

function scaleValue(
  value: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
) {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

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
      const scrollPercent = ((window.scrollY - 1000) / 2000) * 100;
      console.log(((window.scrollY - 1000) / 2000) * 100);
      const containerWidth = containerRef.current
        ? containerRef?.current?.clientWidth
        : 0;
      console.log(containerWidth, "container");
      if (scrollPercent < 0) {
      }
      if (scrollPercent < 33.333333333333) {
        console.log((scrollPercent / 100) * containerWidth);

        setProgressWidth1(
          (scaleValue(scrollPercent, 0, 33.333333333333, 0, 100) / 100) *
            containerWidth
        );
        setProgressWidth2(0);
        setBreakpoint(0);
      } else if (scrollPercent >= 33.33 && scrollPercent < 66.66666666) {
        setProgressWidth1(
          (scaleValue(33.333333333333, 0, 33.333333333333, 0, 100) / 100) *
            containerWidth
        );
        setProgressWidth2(
          (scaleValue(scrollPercent - 33.3333333, 0, 33.333333333333, 0, 100) /
            100) *
            containerWidth +
            5
        );
        setBreakpoint(1);
      } else {
        setProgressWidth1(
          (scaleValue(33.333333333333, 0, 33.333333333333, 0, 100) / 100) *
            containerWidth
        );
        setProgressWidth2(
          (scaleValue(66.66666666 - 33.3333333, 0, 33.333333333333, 0, 100) /
            100) *
            containerWidth +
            5
        );
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
    <div className="row ">
      <div className="mb-[100px]">
        <h1 className="font-bold text-white px-10 text-3xl text-center mb-10">
          Empower Students with Dynamic Learning Experiences
        </h1>
        <h3 className="text-center px-80 text-md text-gray font-semibold">
          Revolutionize your study experience by effortlessly converting PPTs
          into interactive courses. Our intuitive platform streamlines the
          process, empowering active learning and unlocking academic potential.
        </h3>
      </div>
      <div className="row h-[2350px] " id="features-section">
        <StickyBox
          offsetTop={0}
          offsetBottom={0}
          className="flex justify-center w-full bg-secondaryBackground h-screen justify-center flex items-center"
        >
          <div className="overflow-hidden flex justify-center  w-[89%]  bg-[linear-gradient(to_right,rgba(25,25,25,0)_0%,rgba(25,25,25,1)_20%,rgba(25,25,25,1)_25%,rgba(25,25,25,1)_25%,rgba(25,25,25,1)_35%,rgba(25,25,25,1)_35%,rgba(25,25,25,1)_50%,rgba(25,25,25,1)_65%,rgba(25,25,25,1)_65%,rgba(25,25,25,1)_75%,rgba(25,25,25,1)_75%,rgba(25,25,25,1)_80%,rgba(25,25,25,0)_100%)] ">
            {/* <div className="w-[155px] h-5 bg-white">

</div> */}
            <div className=" w-[90%]  ">
              <div className="px-16 mt-6">
                <div className="flex justify-between items-center  text-2xl font-bold">
                  <span
                    className={`text-5xl tracking-tighter ${
                      breakpoint >= 0 && "text-white"
                    }`}
                  >
                    UPLOAD
                  </span>
                  <div
                    id="build"
                    ref={containerRef}
                    className="relative h-1 w-full bg-gray-500 rounded-full mx-4"
                  >
                    <div
                      className="absolute h-1 bg-white rounded-full progress-bar"
                      style={{ width: `${progressWidth1}px` }}
                    ></div>
                  </div>
                  <span
                    className={`text-5xl tracking-tighter ${
                      breakpoint >= 1 && "text-white"
                    }`}
                  >
                    CONVERT
                  </span>
                  <div className="relative h-1 w-full bg-gray-500 rounded-full mx-4">
                    <div
                      className="absolute h-1 bg-white rounded-full progress-bar"
                      style={{ width: `${progressWidth2}px` }}
                    ></div>
                  </div>
                  <span
                    className={`text-5xl tracking-tighter ${
                      breakpoint >= 2 && "text-white"
                    }`}
                  >
                    STUDY
                  </span>
                </div>
              </div>
              {/* <div className="w-full"> */}
              <AnimatePresence mode="wait">
                {breakpoint === 0 ? (
                  <UploadContent key={breakpoint} />
                ) : breakpoint === 1 ? (
                  <ConvertContent key={breakpoint} />
                ) : (
                  <StudyContent key={breakpoint} />
                )}
              </AnimatePresence>

              {/* </div> */}
            </div>
          </div>
        </StickyBox>
      </div>
    </div>
  );
};

export default Buildup;
