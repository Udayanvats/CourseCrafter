"use client";
import React from "react";
import { motion } from "framer-motion";
import Laptop from "@/app/demo/laptop";
import { SparklesCore } from "@/components/ui/sparkles";

const Video = () => {
  return (
    <div className="relative py-16 bg-black-950 mt-10" id="usage">
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-extrabold text-center text-white mb-8 text-shadow-lg leading-tight"
        >
          Explore the functionalities of CourseCrafter
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Laptop />
        </motion.div>
      </div>
    </div>
  );
};

export default Video;
