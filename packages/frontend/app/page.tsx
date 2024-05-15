import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";
import Navbar from "./_components/navbar";
import Hero from "./_components/landingpage/hero";
import GetStartedButton from "./_components/landingpage/button";
import Buildup from "./_components/landingpage/buildup";
import Features from "./_components/landingpage/Features";
import Video from "./_components/landingpage/video";

const LandingPage = () => {
  return (
    <div className="h-full w-full">
      {/* <Navbar /> */}
      <div className="bg-background">
        <div className="h-[40rem] w-full  bg-background relative flex flex-col items-center justify-center antialiased">
          <Hero />
          <GetStartedButton />
        </div>
        <Buildup />
        <div className="px-20 pb-6 pt-6 shadow-lg shadow-gray-50  border rounded-lg mx-12 border-gray mt-16 ">
          <Features />
        </div>
{/* Hello */}
        <Video />
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default LandingPage;
