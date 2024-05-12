"use client";
import React from "react";
import CheckIcon from "../../_components/course/checkIcon";
import { Badge } from "@/components/ui/badge";
// import { ClockIcon } from "lucide-react";
import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import { useRouter } from "next/navigation";
import { SlOptionsVertical } from "react-icons/sl";
import { post } from "@/api";

interface CoursecardProps {
  topic: string;
  status: boolean;
  username: string;
  id: string;
  setCourses: any;
}

function Progress({ percentage }: {
  percentage: number
}) {
  return (
    <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      counterClockwise={false}
      background={true}
      backgroundPadding={10}

      styles={{
        path: {
          stroke: `rgba(255, 255, 255, ${percentage / 100})`,
          strokeWidth: 8,
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0s",
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
        },
        trail: {
          stroke: "#d6d6d6",
          strokeWidth: 12, // Increase the width of the trail

        },
        text: {
          fill: "#f88",
          fontWeight: "bold",
          fontSize: "20px",
          dominantBaseline: "middle", // Center vertically
          textAnchor: "middle", // Center horizontally
        },
        background: {

          width: "500px",

        },
      }}
      className="w-20 h-20 fill-background"
    />
  )
}

const Coursecard = ({ topic, status, id,setCourses }: CoursecardProps) => {
  const percentage = 70;
  const router = useRouter()
  const getDaysAgo = (date: Date): number => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  async function deleteCourse() {
    console.log("delete", id)
    await post("deleteCourse", JSON.stringify({ courseId: id }))
      setCourses((prev: any) => {
        return prev.filter((course: any) => course.id !== id)
      }
      )
  }
  return (
    <motion.tr
      className="rounded-xl"

      whileHover={{
        backgroundColor: "#31363F",
        borderRadius: 20

      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",


      }}

    >
      <td onClick={() => {
        router.push(`/course/${id}`)
      }}>
        {topic}
      </td>
      <td>
        {new Date().toLocaleDateString()}
      </td>
      <td>
        <Progress percentage={70} />
      </td>


      <td>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1"> <SlOptionsVertical /></div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a onClick={deleteCourse}>Delete</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </div>



      </td>

    </motion.tr>



  );
};




export default Coursecard;
