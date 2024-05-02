"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



export default function ProcessingCourseComponent({courseId}:{
    courseId:string|null
}) {

    const router= useRouter()
    useEffect(()=>{
        //server sent event
        if(!courseId){
            return
        }
        const eventSource = new EventSource('/api/courses/processing')
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            if(data.status === 'done'){
                eventSource.close()
                //@ts-ignore
                document?.getElementById('my_modal_3')?.close()
                router.replace("/course/"+courseId)

            }
        }


    },[])


    return (
        <div>
            Processing your course
        </div>
    )
}