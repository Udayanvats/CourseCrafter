
"use client"

import UploadForm from "./form"


export default function Upload() {
    return (

        <div>
            <button className="btn btn-primary text-white" onClick={() => {
                //@ts-ignore
                document?.getElementById('my_modal_1')?.showModal()
            }}>Upload</button>

            <dialog id="my_modal_1" className="modal ">
                <div className="modal-box max-w-none w-[60vw] min-w-[500px]">
                <UploadForm/>
                   
                </div>
            </dialog>
        </div>
    )

}
