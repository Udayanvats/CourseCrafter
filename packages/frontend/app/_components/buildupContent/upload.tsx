"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineFilePpt } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";


export default function UploadContent() {
    return (
        <motion.div
        exit={{
            x: -1000,
            // scale:0.7,
            opacity: 0,
          }}
          key="green"
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
                    <span className="text-white">UPLOAD </span>
                     YOUR STUDY MATERIALS

                </div>
                <div className="mt-5 text-[19px]">
                    Easily upload your study materail and previous year questions and we will convert them into interactive study guides for you.
                </div>
                <div className="mt-9 flex h-[300px]">
                    <div className=" border border-blue-400 w-fit h-fit m-3 rounded-xl p-5">
                        <div className="flex items-center">

                            <div className=" bg-blue-950 p-4 w-fit rounded-lg">

                                <AiOutlineFilePpt size={55} className="fill-blue-500" />
                            </div>
                            <div className=" bg-orange-950 p-4 w-fit rounded-lg ml-3">

                                <FaRegFilePdf size={55} className="fill-orange-500" />
                            </div>

                            <div className="text-white text-2xl font-bold ml-3">
                                Upload your Documents
                            </div>
                        </div>
                        <div className="mt-6 text-[18px]">
                            We Accept both ppts and pdfs. Upload your documents and we will extract the text from them to generate best course for you.
                        </div>

                    </div>
                    <div className="  w-fit h-fit m-3 rounded-xl overflow-hidden">
                        <Image src={"/uploadPpts.png"} alt={"upload"} width={920} height={900} />

                    </div>

                </div>

            </div>
        </motion.div>
    )
}