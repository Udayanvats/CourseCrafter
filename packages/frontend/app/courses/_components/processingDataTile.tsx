import { RiFilePpt2Fill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";
import { motion } from "framer-motion"
import { tailspin } from 'ldrs'
import { FaCircleCheck } from "react-icons/fa6";


tailspin.register()


export default function ProcessingDataTile({ filename, status, type }: {
    filename: string,
    status: boolean,
    type: string

}) {
    return (
        <motion.div
        layout
        transition={{ duration: 2 }}
        className={`w-full p-2 my-2 hover:bg-black flex rounded-xl ${status?"bg-green-900":"bg-card"} items-center justify-between flex-row `}>
            <div className="flex items-center">

                <div className="bg-background p-2 mr-3 rounded-md">
                    {
                        type === "doc" ?
                            <IoDocumentText size={20} />
                            :
                            <RiFilePpt2Fill size={20} />
                    }

                </div>
                <div className="font-bold">
                    {filename}
                </div>

            </div>
            <div className="mx-2">
                {
                    !status ?
                        <div className="ml-2 ">
                            <l-tailspin
                                size="30"
                                stroke="5"
                                speed="0.9"
                                color="gray"
                            ></l-tailspin>
                        </div>
                        :
                        <div className="ml-2">
                            <FaCircleCheck size={20} className="fill-green-500" />
                        </div>
                }
            </div>

        </motion.div>
    )

}