"use client";
import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div id="aboutus" className="  bg-black-400 shadow-xl py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-8"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg mb-6"
        >
          CourseCrafter is developed by Anurag Raut and Udayan Vats, Third-year
          undergrad students pursuing their BTech from DJ Sanghvi College of
          Engineering, Mumbai.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center space-x-8"
        >
          <div className="w-40 h-40 bg-gray-300 rounded-full">
            <img
              src="/anurag.jpeg"
              alt="logo"
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="w-40 h-40 bg-gray-300 rounded-full">
            <img
              src="/udayan'.jpeg"
              alt="logo"
              className="w-full h-full rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
