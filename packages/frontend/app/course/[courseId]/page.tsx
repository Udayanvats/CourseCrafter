"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



export default function CoursePage({params:{
    courseId

}}:{
    params:{
        courseId:string
    }
}) {
  
    console.log(courseId)
    useEffect(()=>{
       function startES(){
        const evventStream = new EventSource('http://localhost:8080/coursecontent/'+courseId)
        evventStream.onmessage = (event) => {
            console.log(event.data)
        }

       }
         startES()
    },[])


    return (
        <div>
            <h1>Course Page</h1>
        </div>
    )

}