import React from "react";
import ButtonSkeleton from "../skeleton/buttonskeleton";

interface ButtoncompProps {
  text: string;
  isSelected: boolean;
  isLoading: boolean;
}
const Buttoncomponent = ({ text, isSelected, isLoading }: ButtoncompProps) => {
  return { isLoading } ? (
    <ButtonSkeleton />
  ) : (
    <button
      className={`btn flex-shrink-0 px-4 py-2 rounded-md cursor-pointer ${
        isSelected
          ? "bg-gray-900 text-white border border-gray-900"
          : "bg-white text-gray-900 border border-white"
      } hover:bg-gray-800`}
    >
      {text}
    </button>
  );
};

export default Buttoncomponent;
