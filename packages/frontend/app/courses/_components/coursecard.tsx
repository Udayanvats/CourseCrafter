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
import { FaBookmark } from "react-icons/fa";
import { Course } from "./table";
import CircularProgressCountUp from "./progress";
import { MdOutlineDeleteOutline } from "react-icons/md";

interface CoursecardProps {
  course: Course;
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
          stroke: `rgba(168, 85, 247, ${percentage / 100})`,
          strokeWidth: 8,
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0s",
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
        },
        trail: {
          stroke: "#d6d6d6",
          strokeWidth: 15, // Increase the width of the trail

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
      className="w-20 h-20 fill-secondaryBackground"
    />
  )
}

const Coursecard = ({ course, status, id, setCourses }: CoursecardProps) => {
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
    const elem = document.activeElement;
    if (elem) {
      //@ts-ignore
      elem?.blur();
    }

  }
  console.log(course.totalChapters, "total Chaptersss")
  return (
    <motion.tr
      className="rounded-none border border-l-0 border-b-1 border-r-0 border-t-0 border-gray-500 table table-fixed "

      whileHover={{
        backgroundColor: "#31363F",


      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",


      }}

      onClick={(e) => {
        // Check if the target element is not the bookmark or delete button
        if (
          !((e.target as Element).closest(".bookmark-button")) &&
          !(e.target as Element).closest(".delete-button")
        ) {
          router.push(`/course/${id}`);
        }
      }}
    >
      <td >
        {course.title}
      </td>
      <td>
        {new Date(course.createdAt).toLocaleDateString()}
      </td>
      <td>
        <CircularProgressCountUp 
        progress={Number(Number((course.progress/course.totalChapters)*100).toFixed(0))}
        />
      </td>


      <td className="" onClick={(e)=>{
        e.stopPropagation()
      }}>
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1"> <SlOptionsVertical /></div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a onClick={deleteCourse}>Delete</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </div> */}
        <div className="flex items-center ">

          <div className="mr-3 flex ">
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="m-0 p-0 delete-button" onClick={(e) =>{
                e.stopPropagation()
              //@ts-ignore
              document.getElementById('my_modal_2').showModal()
              
              }}>
              <MdOutlineDeleteOutline size={35} color="red" />
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <div>

                  <h3 className="font-bold text-lg">Delete Course {course.title}</h3>
                  <p className="py-4">This action is irreversible , Are you sure you want to delete course <span className="font-bold">{course.title}</span></p>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => {
                    //@ts-ignore
                    document.getElementById('my_modal_2').close()
                  }} className="btn btn-neutral mx-3">Cancel</button>
                  <button onClick={() => {
                    deleteCourse()
                    //@ts-ignore
                    document.getElementById('my_modal_2').close()
                  }} className="btn btn-error mx-3">Delete</button>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>

            </dialog>

          </div>
          <div>
            <FaBookmark  onClick={async (e) => {
                 e.stopPropagation()
              await post("updateBookmarkStatus", JSON.stringify({ courseId: id, bookmark: !course.isBookmark }))
              setCourses((prev: any) => {
                return prev.map((course: any) => {
                  if (course.id === id) {
                    return { ...course, isBookmark: !course.isBookmark }
                  }
                  return course
                })
              }
              )
              e.stopPropagation()
            }} size={25} className={`${course.isBookmark && "fill-primary"} hover:cursor-pointer hover:fill-gray-400 transition-all duration-200 bookmark-button`} />
          </div>


        </div>

      </td>

    </motion.tr>



  );
};




export default Coursecard;
