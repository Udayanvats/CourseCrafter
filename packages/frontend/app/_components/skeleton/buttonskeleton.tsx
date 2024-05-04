import React from "react";

const ButtonSkeleton = () => {
  return (
    <button className="bg-gray-300 dark:bg-gray-600 w-40 h-10 rounded-md animate-pulse hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"></button>
  );
};

export default ButtonSkeleton;
