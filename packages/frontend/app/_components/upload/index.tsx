
"use client"

import { useState } from "react"
import UploadForm from "./form"
import { MdFileUpload } from "react-icons/md";

export type UploadProps = {
    docs: Array<File>
    pyqs: Array<File>
    mode: number
    title: string

}

export default function Upload({ className, label }: {
    className?: string,
    label?: string
}) {
    const [uploadFormData, setUploadFormData] = useState<UploadProps>({
        docs: [],
        pyqs: [],
        mode: 0,
        title: "New couse"
    })


    return (

        <div>
            <button className={`flex py-1.5  bg-gradient-full  text-white text-md p-0 hover:bg-gradient-secondary ${className}`} onClick={() => {
             
                //@ts-ignore
                document?.getElementById('upload_modal')?.showModal()
            }}> {label ?? "Upload"}<MdFileUpload size={30} />

            </button>

            <dialog id="upload_modal" className="modal ">
              
                <div className="modal-box  max-w-none w-[60vw] min-w-[500px] m-6">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                    <UploadForm uploadFormData={uploadFormData} setUploadFormData={setUploadFormData} />

                </div>
            </dialog>
        </div>
    )

}
