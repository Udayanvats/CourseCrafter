import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";
import Navbar from "./_components/navbar";
import Hero from "./_components/landingpage/hero";
import GetStartedButton from "./_components/landingpage/button";
import Buildup from "./_components/landingpage/buildup";
import Features from "./_components/landingpage/Features";
import Video from "./_components/landingpage/video";
import { AiOutlineFilePpt } from "react-icons/ai";
import UploadContent from "./_components/buildupContent/upload";
import ConvertContent from "./_components/buildupContent/convert";
import AboutUs from "./_components/landingpage/aboutus";
import Footer from "./_components/landingpage/footer";

const LandingPage = () => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <div className="bg-background">
        <div className="h-[45rem] w-full  bg-background relative flex flex-col items-center justify-center antialiased">
          <Hero />
          <GetStartedButton />
        </div>
        <Buildup />
        {/* Hello */}
        <Video />
        <AboutUs />
        <Footer />
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default LandingPage;
