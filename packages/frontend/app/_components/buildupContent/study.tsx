"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineFilePpt } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { IoBook } from "react-icons/io5";


export default function StudyContent() {
    return (
        <motion.div
        exit={{
            x: -1000,
            // scale:0.7,
            opacity: 0,
          }}
         
          initial={{
            x: 1000,
            // scale:0.7,
            opacity: 0,
          }}
          animate={{
            x: 0,
            // scale:1,
            opacity: 1,
            //
          }}
          transition={{
            duration: 0.3,
          }}
        className="px-20 pb-6 pt-6 shadow-lg    rounded-lg mx-12  mt-16 ">
            <div className="h-[500px] ">
                <div className="text-2xl  font-bold tracking-wide text-gray-500">
                    <span className="text-white">STUDY.</span>
                    YOUR OWN PERSONALIZED COURSE

                </div>
                <div className="mt-5 text-[19px]">
                Effortlessly study with our AI-enhanced, topic-wise courses designed to deepen your understanding. Each course includes previous year questions and intuitive progress tracking to ensure comprehensive learning.
                </div>
                <div className="mt-9 flex h-[300px]">
                    <div className=" border border-blue-400 w-fit h-fit m-3 rounded-xl p-5">
                        <div className="flex items-center">

                            <div className=" bg-blue-950 p-4 w-fit rounded-lg">

                                <IoBook size={45} className="fill-blue-500" />
                            </div>
                         

                            <div className="text-white text-2xl font-bold ml-3">
                                Upload your Documents
                            </div>
                        </div>
                        <div className="mt-2 text-[16px]">
                        Enhance your learning experience with our topic-wise courses, each complete with curated previous year questions. Track your progress and master each subject with ease!

                        </div>

                    </div>
                    <div className="  w-fit h-fit my-3 rounded-xl overflow-hidden">
                        <Image src={"/study.png"} alt={"upload"} width={1000} height={800} />

                    </div>

                </div>

            </div>
        </motion.div>
    )
}