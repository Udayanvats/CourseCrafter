"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";



export default function Sidebar(){
    const pathname=usePathname();
    const pathIndex=2
    const currentPath=pathname.split('/')[pathIndex]??""
    const previousPath=pathname.split('/').slice(0,pathIndex).join('/')
    console.log("currentPath",currentPath)
    return (
        <div className="  w-[300px] min-h-full h-full  left-0 flex flex-col      ">

            <Link className={` p-3   rounded-l-lg ${currentPath===""&&"border-l-[6px] border-l-purple-500 bg-indigo-950"}  w-full text-white font-bold hover:bg-[#290924] transition-all duration-200 `} href={'/courses'}> All Courses</Link>

            <Link className={` p-3   rounded-l-lg ${currentPath==="bookmarks"&&"border-l-[6px] border-l-purple-500 bg-indigo-950"}  w-full text-white font-bold hover:bg-[#290924] transition-all duration-300 `} href={'/courses/bookmarks'}> Bookmarks</Link>

        </div>
    )

}