import { ReactNode } from "react"
import Sidebar from "./_components/sidebar"




export default function Layout({children}:{
    children:ReactNode
}){

    return (
        <div className=" h-[calc(100vh-89px)]  w-full flex">
            <Sidebar/>
            <div className=" w-full h-full bg-secondaryBackground">

            {children}
            </div>
        </div>
    )
}