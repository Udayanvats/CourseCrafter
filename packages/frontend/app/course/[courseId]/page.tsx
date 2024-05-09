"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { parse } from 'best-effort-json-parser'
import Sidebar from "./_components/sidebar"
import ContentComponent from "./_components/contentComponent"
import { useLocalStorage } from 'usehooks-ts'
export type TopicList = {
    topic: string,
    subtopics: string[],

}

export type ContentType={
    Introduction:String,
    Content:[String],
    Conclusion:String,

}

type EventSourceData={
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

    const [currentTopicIndex,setCurrentTopicIndex]=useLocalStorage<number>("currentTopicIndex", 0);



    const [jsonData, setJsonData] = useState<ContentType[]>([])

    console.log(courseId)
    useEffect(() => {
        function startES() {
            const eventStream = new EventSource('http://localhost:8080/coursecontent/' + courseId)
            eventStream.onmessage = (event) => {
                // console.log(event.data)
                const eventSourseData: EventSourceData = JSON.parse(event.data)
                if (eventSourseData?.done == true) {
                    eventStream.close()
                    return
                }
                else if(eventSourseData?.topicList){
                    
                    setTopicList(JSON.parse(eventSourseData.topicList))
                    
                }
                else if(eventSourseData?.pyqContent){
                    console.log(eventSourseData.pyqContent,"PYQ CONTENT")
                }
                else {

                    setStreamText((prev) => prev + eventSourseData.data)
                }




            }

        }
        startES()
    }, [])

    // console.log(streamText)


    useEffect(() => {
        try {


            if (streamText != "") {
                setJsonData(parse(streamText))
                console.log(streamText)
            }
        } catch {
            console.log(streamText)
        }
    }, [streamText])

    // console.log(jsonData[0]?.topicName)


    return (
        <div className="w-full h-full flex  " >
        
            <Sidebar topicList={topicList} currentTopicIndex={currentTopicIndex} />
            {/* {streamText} */}
            <ContentComponent data={jsonData}  topicList={topicList} currentTopicIndex={currentTopicIndex} setCurrentTopicIndex={setCurrentTopicIndex} />
        </div>
    )

}