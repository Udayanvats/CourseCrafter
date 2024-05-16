


"use client"

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import {motion} from "framer-motion";


export default function UploadPYQs({ docs, setDocs }: {
    docs: Array<File>
    setDocs: Function

}) {
    console.log(docs,"docs")

    const onDrop = async (acceptedFiles: Array<File>) => {
       

        setDocs([...docs, ...acceptedFiles])





    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="w-full flex my-9 gap-5">

            <div {...getRootProps()} className="w-full">
                <label className="block border-2 border-dashed border-gray-600 p-8 rounded-lg text-center cursor-pointer flex flex-col items-center">
                    <FaCloudUploadAlt className="fill-primary" size={80} />

                    <p className="text-lg">Upload Previous Years questions by clicking here</p>
                </label>
                <input
                    {...getInputProps()}
                    className="hidden"
                    id="upload" // Match this with the htmlFor attribute of the label
                    type="file"
                />
            </div>
            <div className="w-full">

                <div className="text-md  text-white font-bold opacity-80">
                    Your uploaded Documents -

                    <div>
                        {
                              docs.length > 0 ? <div className="flex flex-col gap-2">
                              {docs.map((doc: File, index: number) => (
                                  <motion.div whileHover={{
                                    className:"bg-gray-600",
                                  }} key={index} className=" p-2 bg-gray-700 hover:bg-gray-600 transition-all duration-400    rounded-lg flex justify-between mt-2 max-h-full overflow overflow-y-auto">
                                    <div className="flex justify-center">

                                      <IoDocumentText size={22} opacity={0.6} />
                                      <div className="mx-3">
                                        {doc.name}

                                      </div>
                                    </div>

                                    <TiDeleteOutline onClick={()=>{
                                        console.log(docs.filter((item:File)=>item!==doc),"docs")
                                        setDocs(docs.filter((item:File)=>item!==doc))
                                    }} size={20} className="fill-red-500" />



                                  </motion.div>
                              ))}
                              </div>
                              :
                                <div className=" p-2 rounded-lg flex flex-col   items-center">
                                   <Image
                                    src={"/no-content.png"}
                                    alt="No content"
                                    width={100}
                                    height={100}
                                    className="my-4"
                                   />
                                   <div className="text-sm text-white opacity-70">
                                    No Documents selcted
                                   </div>
                                </div>
                        }
                    </div>

                </div>
            </div>

        </div>
    )
}