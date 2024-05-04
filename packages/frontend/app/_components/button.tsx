"use client";
import React from "react";

interface ButtonProps {
  text: string;
  padding: string;
  backgroundColor: string;
  color: string;
}
const Button = ({ text, padding, backgroundColor, color }: ButtonProps) => {
  const hoverColor = backgroundColor === "blue" ? "bg-blue" : "bg-white";

  return (
    <div>
      <button
        className={`btn ${padding} bg-${backgroundColor} text-${color}   rounded-md border border-gray-200  font-medium text-gray-50 hover:${hoverColor}`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
