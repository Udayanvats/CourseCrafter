"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProcessingDataTable from "./processingDataTable"

export type ProcessingData = {
    [key: string]: {
        type: string
        status: boolean
    }
}

export default function ProcessingCourseComponent({ courseId }: {
    courseId: string | null
}) {

    const [processingData, setProcessingData] = useState<ProcessingData>({})

    const router = useRouter()
    useEffect(() => {
        //server sent event
        if (!courseId) {
            return
        }
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseId}/status`,{
            withCredentials:true
        })
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            if (data?.done) {
                router.push(`/course/${courseId}`)
            }
            else if (data?.processingData) {
                console.log(JSON.parse(data.processingData))
                setProcessingData(JSON.parse(data.processingData))
            }
            else if (data?.data) {
                setProcessingData((prev) =>
                    ({ ...prev, [data.data]: { ...prev[data.data], status: true } })
                )







            }

        }

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
        }

        return () => {
            eventSource.close()
        }


    }, [courseId])


    return (
        <div className="">
            <div id="header" >
                    {courseId}
                <div className="font-extrabold text-white"  >
                    Processing Files
                </div>
                <div className="text-sm ]">
                    Your files are being processed. This may take a few minutes.


                </div>

                <div className="mt-5">
                    <ProcessingDataTable
                        processingData={processingData}

                    />
                </div>
            </div>
        </div>
    )
}