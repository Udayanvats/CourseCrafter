
"use client"

import { useState } from "react"
import UploadForm from "./form"

export type UploadProps = {
    docs: Array<File>
    pyqs: Array<File>
    mode:number
    title:string

}

export default function Upload() {
    const  [uploadFormData, setUploadFormData] = useState<UploadProps>({
        docs: [],
        pyqs: [],
        mode:0,
        title:"New couse"
    })
    

    return (

        <div>
            <button className="btn btn-primary text-white" onClick={() => {
                //@ts-ignore
                document?.getElementById('my_modal_1')?.showModal()
            }}>Upload</button>

            <dialog id="my_modal_1" className="modal ">
                <div className="modal-box  max-w-none w-[60vw] min-w-[500px] m-6">
                <UploadForm uploadFormData={uploadFormData} setUploadFormData={setUploadFormData} />
                   
                </div>
            </dialog>
        </div>
    )

}
