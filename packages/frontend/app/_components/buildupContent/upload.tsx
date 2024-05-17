
import Image from "next/image";
import { AiOutlineFilePpt } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";


export default function UploadContent() {
    return (
        <div className="px-20 pb-6 pt-6 shadow-lg shadow-gray-50  border rounded-lg mx-12 border-gray mt-16 ">
            <div className="h-[500px] border p-3">
                <div className="text-2xl  font-bold tracking-wide text-gray-500">
                    <span className="text-white">BUILD.</span>
                    STREAMLINE YOUR DEVELOPMENT

                </div>
                <div className="mt-5 text-[19px]">
                    Easily build applications with our intuitive tools, simplifying database interactions, schema evolution, and data management. Lay a solid foundation for your application while ensuring adaptability to future needs
                </div>
                <div className="mt-9 flex h-[300px]">
                    <div className=" border border-blue-400 w-fit h-fit m-3 rounded-xl p-9">
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
                        <Image src={"/uploadPpts.png"} alt={"upload"} width={820} height={700} />

                    </div>

                </div>

            </div>
        </div>
    )
}