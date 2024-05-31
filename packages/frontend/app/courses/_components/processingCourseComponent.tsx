"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProcessingDataTable from "./processingDataTable"
// import { quantum } from 'ldrs'
import { AnimatePresence } from "framer-motion"
import { motion } from "framer-motion"

// quantum.register()

// Default values shown

export type ProcessingData = {
    [key: string]: {
        type: string
        status: boolean
    }
}

export default function ProcessingCourseComponent({ courseId }: {
    courseId: string | null
}) {
    import('ldrs').then(ldrs => {
        const { quantum } = ldrs;

        // Register components
        quantum.register();
    });
    const [processingData, setProcessingData] = useState<ProcessingData>({})
    const [processingStage, setProcessingStage] = useState<number>(0)
    const router = useRouter()
    useEffect(() => {
        //server sent event
        if (!courseId) {
            return
        }
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseId}/status`, {
            withCredentials: true
        })
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            if (data?.done) {
                router.push(`/course/${courseId}`)
            }
            else if (data?.docsDone) {
                setProcessingStage(1)
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
        <div className="overflow overflow-hidden h-full">
            <AnimatePresence mode="wait">
                {
                    processingStage == 0 ?
                        <motion.div
                            exit={{
                                x: -200,
                                // scale:0.7,
                                opacity: 0,
                            }}
                            key={"processing-docs"}
                            initial={{
                                x: 200,
                                // scale:0.7,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                // scale:1,
                                opacity: 1,
                                //
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                        >
                            <div className="font-extrabold text-white"  >
                                Processing Files
                            </div>
                            <div className="text-sm ">
                                Your files are being processed. This may take a few minutes.


                            </div>

                            <div className="mt-5">
                                <ProcessingDataTable
                                    processingData={processingData}
                                />
                            </div>
                        </motion.div>
                        :

                        <motion.div
                            exit={{
                                x: -200,
                                // scale:0.7,
                                opacity: 0,
                            }}
                            key={"generating-topics"}
                            initial={{
                                x: 200,
                                // scale:0.7,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                // scale:1,
                                opacity: 1,
                                //
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                        >
                            <div className="font-extrabold text-white"  >
                                Generating Topics
                            </div>
                            <div className="text-sm ">
                                Topics for your Course is getting generated. This may take a few seconds.


                            </div>

                            <div className="my-7 flex justify-center item-center">
                                {/* <l-quantum
                                    size="55"
                                    speed="2"
                                    color="rgba(168, 85, 247, 1)"
                                ></l-quantum> */}
                            </div>
                        </motion.div>
                }
            </AnimatePresence>

        </div>
    )
}