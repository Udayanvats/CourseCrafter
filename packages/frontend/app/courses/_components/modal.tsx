
"use client"

import { useEffect, useState } from "react"
import ProcessingCourseComponent from "./processingCourseComponent"
import { useSearchParams } from "next/navigation"

export default function PocessingModal({ children }: {
    children: React.ReactNode
}) {
    const searchParams = useSearchParams()


    const [courseId, setCourseId] = useState<string | null>(null)
    useEffect(() => {
        const courseId = searchParams.get('courseId')
        setCourseId(courseId)
        if (courseId) {
            console.log("courseId", courseId)
            //@ts-ignore
            document.getElementById('upload_modal')?.close()
            // @ts-ignore
            document.getElementById('processing_modal').showModal()
        }



    }
        , [searchParams])

    return (
        <div>

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            {children}
            <dialog id="processing_modal" className="modal">
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