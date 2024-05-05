"use client";
import React from "react";
import CheckIcon from "./checkIcon";
import { Badge } from "@/components/ui/badge";
// import { ClockIcon } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
interface CoursecardProps {
  topic: string;
  status: boolean;
  username: string;
}
const Coursecard = ({ topic, status, username }: CoursecardProps) => {
  const percentage = 70;

  const getDaysAgo = (date: Date): number => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return (
    <div className="border p-4 flex items-center justify-between rounded-md shadow-md ">
      <div className="flex">
        <div className="w-16 h-16 m-4 bg-zinc-200 flex items-center justify-center">
          <img src="https://placehold.co/64" alt="Course Thumbnail" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{topic}</h3>
          <p className="text-sm text-gray-500">PowerPoint, Excel, Tableau</p>
          <p className="text-xs text-gray-400 mt-1">{username} - 18d ago</p>
          <div className="flex items-center mt-2">
            <Badge className="text-black" variant="secondary">
              {status == true ? "Converted" : "Pending"}
            </Badge>

            {status == true ? (
              <CheckIcon className="ml-2 h-4 w-4 text-green-500" />
            ) : (
              <div>

              </div>
              // <ClockIcon className="ml-2 h-4 w-4 text-yellow-500" />
            )}
          </div>
        </div>
      </div>

      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        counterClockwise={false}
        background={true}
        backgroundPadding={10}
        styles={{
          path: {
            stroke: `rgba(62, 152, 199, ${percentage / 100})`,
            strokeWidth: 4,
            strokeLinecap: "butt",
            transition: "stroke-dashoffset 0.5s ease 0s",
            transform: "rotate(0.25turn)",
            transformOrigin: "center center",
          },
          trail: {
            stroke: "#d6d6d6",
            strokeWidth: 14, // Increase the width of the trail
            // strokeLinecap: "butt",
            // transform: "rotate(0.25turn)",
            // transformOrigin: "center center",
          },
          text: {
            fill: "#f88",
            fontWeight: "bold",
            fontSize: "20px",
            dominantBaseline: "middle", // Center vertically
            textAnchor: "middle", // Center horizontally
          },
          background: {
            fill: "#FFFF", // Change the color of the background
            width:"500px"
          },
        }}
        className="w-20 h-20"
      />
    </div>
  );
};

export default Coursecard;
