"use client"

import Image from "next/image";
import { AiOutlineFilePpt } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";
import { RiBardLine } from "react-icons/ri";
import {motion} from "framer-motion"

export default function ConvertContent() {
    return (
        <motion.div 
        exit={{
            x: -1000,
            // scale:0.7,
            opacity: 0,
          }}
          key="purple"

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

        className="px-20 pb-6 pt-6  rounded-lg mx-12  mt-16 ">
            <div className="h-[500px] ">
                <div className="text-2xl  font-bold tracking-wide text-gray-500">
                    <span className="text-white">CONVERT. </span>
                    STREAMLINE YOUR DEVELOPMENT

                </div>
                <div className="mt-5 text-[19px]">
                    Easily build applications with our intuitive tools, simplifying database interactions, schema evolution, and data management. Lay a solid foundation for your application while ensuring adaptability to future needs
                </div>
                <div className="mt-9 flex h-[300px]">
                    <div className=" border border-blue-400 w-fit h-fit m-3 rounded-xl p-9">
                        <div className="flex items-center">

                            <div className=" bg-blue-950 p-4 w-fit rounded-lg">

                                <RiBardLine size={55} className="fill-blue-500" />
                            </div>
                          

                            <div className="text-white text-2xl font-bold ml-3">
                                Convert your Documents
                            </div>
                        </div>
                        <div className="mt-6 text-[18px]">
                            We Use the latest AI technology to convert your ppts into easy to understand notes. This will help you to understand the content better and also help you to revise the content easily.
                        </div>

                    </div>
                    <div className="  w-fit h-fit m-3 rounded-xl overflow-hidden">
                        <Image src={"/convertPpt.png"} alt={"upload"} width={720} height={700} />

                    </div>

                </div>

            </div>
        </motion.div>
    )
}