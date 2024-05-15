import { ReactNode } from "react"
import Sidebar from "./_components/sidebar"




export default function Layout({children}:{
    children:ReactNode
}){

    return (
        <div className="h-full h-[calc(100vh-89px)]  w-full flex">
            <Sidebar/>
            <div className=" w-full p-5 bg-secondaryBackground">

            {children}
            </div>
        </div>
    )
}