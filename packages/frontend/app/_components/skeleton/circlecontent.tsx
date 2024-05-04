import React from "react";

const CirclecontentSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-60">
      <div className="flex gap-4 items-center">
        <div className="rounded-full bg-gray-300 dark:bg-gray-600 w-16 h-16 animate-pulse"></div>
        <div className="flex flex-col gap-4">
          <div className="bg-gray-300 dark:bg-gray-600 h-4 w-28 rounded-lg animate-pulse"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-4 w-40 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="bg-gray-300 dark:bg-gray-600 h-32 w-full rounded animate-pulse"></div>
    </div>
  );
};

export default CirclecontentSkeleton;
