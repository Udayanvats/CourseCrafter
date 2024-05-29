"use client";
import React, { useState } from "react";
interface AccordionProps {
  title: string;
  content: string;
}
const Accordion = ({ title, content }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" rounded-lg overflow-hidden ">
      <div
        className={`flex justify-between items-center  py-9 cursor-pointer ${
          isOpen ? "bg-transparent" : "bg-transparent"
        }`}
        onClick={toggleAccordion}
      >
        <h3 className="text-lg text-white font-medium">{title}</h3>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div className="px-4 py-3 bg-transaparent text-white ">{content}</div>
      )}
    </div>
  );
};

export default Accordion;
