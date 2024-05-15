"use client"
import { get, post } from "@/api";
import Coursecard from "@/app/courses/_components/coursecard";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";


export type Course = {

    createdAt: string;
    progress: number;
    title: string;
    id: string
    isBookmark: boolean
    totalChapters: number



}

export default function Courses() {
    const [courses, setCourses] = useState<Course[]>([])

    useEffect(() => {
        async function getCourses() {



            const data = await get("courses", {})

            if (data) {
                console.log(data, "asdasd")
                setCourses(data)
            }


        }
        getCourses()
    }, [])

    console.log(courses)
    return (
        <div className="h-full min-h-[300px]">
            {
                courses.length === 0 ?
                    <div className="w-full h-full  flex justify-center items-center flex-col">
                        <Image src={"/no-results.png"} alt="" width={100} height={100} />
                        <div className="text-white font-extrabold text-3xl">No courses found</div>
                        <div className="text-white opacity-60 font-bold text-sm">Start exploring by creating new courses</div>

                    </div>
                    :
                    <div className="border border-gray-500 rounded-xl ">

                    <table className="table  w-full table-fixed ">
                        {/* head */}
                        <thead className="border border-l-0 border-r-0 border-t-0 border-b-2 border-gray-500 table table-fixed">
                            <tr>

                                <th>Course</th>
                                <th>Created at</th>
                                <th>Progress</th>
                                <th>Other</th>
                                

                            </tr>
                        </thead>
                        <tbody className="overflow overflow-y-auto h-[calc(100vh-350px)] max-h-[calc(100vh-350px)] block w-full  ">
                            <AnimatePresence >
                                {
                                    courses?.map((course) => {
                                        return (
                                            <Coursecard
                                                username="sd"
                                                
                                                status={true}
                                                id={course.id}
                                                setCourses={setCourses}
                                                course={course}
                                            />
                                        )
                                    })
                                }

                            </AnimatePresence>

                        </tbody>
                    </table>
                    </div>

            }
           
        </div>
    )
}