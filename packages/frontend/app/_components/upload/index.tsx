
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
                    <div className="modal-action ">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )

}
