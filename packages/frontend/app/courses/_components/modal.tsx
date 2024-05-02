
"use client"

import { useEffect } from "react"
import ProcessingCourseComponent from "./processingCourseComponent"
import { useSearchParams } from "next/navigation"

export default function PocessingModal({ children }: {
    children: React.ReactNode
}) {
    const searchParams = useSearchParams()
    const courseId = searchParams.get('courseId')

    useEffect(() => {
        if (courseId) {
            // @ts-ignore

            document.getElementById('my_modal_3').showModal()
        }

    }
        , [])

    return (
        <div>

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            {children}
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <ProcessingCourseComponent courseId={courseId} />
                </div>
            </dialog>
        </div>
    )
}