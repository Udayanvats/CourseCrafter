
"use client"

import { useState } from "react"
import UploadForm from "./form"

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
            <button className={`btn btn-primary text-white ${className}`} onClick={() => {
             
                //@ts-ignore
                document?.getElementById('upload_modal')?.showModal()
            }}>{label ?? "Upload"}
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
