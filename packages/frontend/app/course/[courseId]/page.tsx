"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { parse } from 'best-effort-json-parser'
import Sidebar from "./_components/sidebar"
import ContentComponent from "./_components/contentComponent"
import { useLocalStorage } from 'usehooks-ts'
import { get } from "@/api"
import Navbar from "@/app/courses/_components/navbar"
export type TopicList = {
    topic: string,
    subtopics: string[],

}

export type ContentType = {
    Introduction: String,
    Content: [String],
    Conclusion: String,

}

type EventSourceData = {
    data: string | null;
    error: string | null;
    done: boolean;
    initialResponse: string | null;
    topicList: string | null;
    pyqContent: string | null;
}




export default function CoursePage({ params: {
    courseId

} }: {
    params: {
        courseId: string
    }
}) {

    const [streamText, setStreamText] = useState("")
    const [topicList, setTopicList] = useState<TopicList[]>([])
    const  [pyqContent, setPyqContent] = useState<any>([])
    const [progressData, setProgressData] = useState<{
        [key: string]: boolean
    }>({})
    const [currentTopicIndex, setCurrentTopicIndex] = useLocalStorage<{
        currentTopicIndex: number
        curentSubTopicIndex: number
    }>("currentTopicIndex", {
        currentTopicIndex: 0,
        curentSubTopicIndex: 0

    });

    console.log()



    const [jsonData, setJsonData] = useState<ContentType[]>([])

    console.log(courseId)
    useEffect(() => {
        function startES() {
            const eventStream = new EventSource('http://localhost:8080/coursecontent/' + courseId)
            eventStream.onmessage = (event) => {
                const eventSourseData: EventSourceData = JSON.parse(event.data)
                console.log(eventSourseData.done)
                if (eventSourseData?.done == true) {
                    eventStream.close()

                }
                else if (eventSourseData?.topicList) {

                    setTopicList(JSON.parse(eventSourseData.topicList))

                }
                else if (eventSourseData?.pyqContent) {
                    console.log(eventSourseData.pyqContent, "PYQ CONTENT")
                    setPyqContent(JSON.parse(eventSourseData.pyqContent))
                }
                if (eventSourseData?.data) {
                    console.log("we are here babay")
                    setStreamText((prev) => prev + eventSourseData.data)
                }




            }

        }
        startES()
    }, [])

    useEffect(() => {
        async function getProgressData() {
            const response = await get("getProgressData?courseId=" + courseId)
            console.log(response?.data, "progress data")
            if (response?.data) {
                setProgressData(response?.data)
            }
        }

        getProgressData()

    }, [])



    // console.log(streamText)


    useEffect(() => {
        try {


            if (streamText != "") {
                setJsonData(parse(streamText))
                console.log(streamText.slice(0, 20), "streamText")
            }
        } catch {
            console.log(streamText)
        }
    }, [streamText])

    // console.log(jsonData[0]?.topicName)


    return (
        <div>
            <Navbar />

            <div className="w-full h-full flex  " >

                <Sidebar progressData={progressData} topicList={topicList} currentTopicIndex={currentTopicIndex.currentTopicIndex} setCurrentTopicIndex={(topic) => setCurrentTopicIndex((prev: any) => ({ ...prev, currentTopicIndex: topic }))}
                    subTopicIndex={currentTopicIndex.curentSubTopicIndex} setSubTopicIndex={(subtopic) => setCurrentTopicIndex((prev: any) => ({ ...prev, curentSubTopicIndex: subtopic }))}

                />

                <ContentComponent pyqContent={pyqContent} setProgressData={setProgressData} courseId={courseId} data={jsonData} topicList={topicList} currentTopicIndex={currentTopicIndex.currentTopicIndex} setCurrentTopicIndex={(topic) => setCurrentTopicIndex((prev: any) => ({ ...prev, currentTopicIndex: topic }))}
                    setSubTopicIndex={(subtopic) => setCurrentTopicIndex((prev: any) => ({ ...prev, curentSubTopicIndex: subtopic }))}
                />
            </div>
        </div>
    )

}