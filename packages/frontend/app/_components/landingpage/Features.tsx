import React from "react";
import Accordion from "./accordion";

const Features = () => {
  return (
    <div className="pt-16">
      <section className="">
        <p className="text-xl font-semibold mb-4 text-left md:text-4xl  bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.green.300),theme(colors.green.100),theme(colors.sky.400),theme(colors.yellow.200),theme(colors.sky.400),theme(colors.green.100),theme(colors.green.300))] bg-[length:200%_auto] animate-gradient">
          Features
        </p>
        <div className="w-[50rem]">
          <p className="text-gray font-semibold">
            Empower users to effortlessly transform their presentations into
            fully-fledged courses with our platform. Streamline the process and
            z unlock a seamless experience, making it easy for individuals to
            convert their PPTs into engaging learning modules.
          </p>
          <div className="mt-10">
            <Accordion
              title="Upload your PPTs"
              content="Upload PPTs to get started"
            />
            <Accordion
              title="Convert PPTs into courses"
              content="Upload PPTs to get started"
            />
            <Accordion
              title="PYQ Analaysis"
              content="Upload PPTs to get started"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
