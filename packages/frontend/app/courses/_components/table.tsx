"use client"
import { get, post } from "@/api";
import Coursecard from "@/app/courses/_components/coursecard";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";


type Course = {

    created_at: string;
    progress: number;
    title: string;
    id: string
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
        <div className=" px-9">
            {
                courses.length === 0 ?
                    <div className="w-full h-full min-h-[500px] flex justify-center items-center flex-col">
                        <Image src={"/no-results.png"} alt="" width={100} height={100} />
                        <div className="text-white font-extrabold text-3xl">No courses found</div>
                        <div className="text-white opacity-60 font-bold text-sm">Start exploring by creating new courses</div>

                    </div>
                    :

                    <table className="table ">
                        {/* head */}
                        <thead>
                            <tr>

                                <th>Course</th>
                                <th>Created at</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence >
                                {
                                    courses?.map((course) => {
                                        return (
                                            <Coursecard
                                                username="sd"
                                                topic={course.title}
                                                status={true}
                                                id={course.id}
                                                setCourses={setCourses}
                                            />
                                        )
                                    })
                                }

                            </AnimatePresence>

                        </tbody>
                    </table>
            }
           
        </div>
    )
}