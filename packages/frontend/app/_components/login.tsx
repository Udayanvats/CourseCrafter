"use client"

import { useEffect, useState } from "react"
import Auth from "../auth/page"
import { get } from "@/api"
import Cookies from "js-cookie";
import Avatar from "./avatar";
export type User = {
    name: string,
    email: string,
    profileImage?: string,
    id: string
}
export default function AuthComponent() {
    const [auth, setAuth] = useState(false)
    const [authToken, setAuthToken] = useState(Cookies.get("token"));
    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        id: ""

    })
    async function logout() {
        await get('logout', ) 
        setAuth(false)
        setAuthToken(undefined)
        
    }
    useEffect(() => {
        async function getLoggedStatus() {
            const res = await get('isLoggedIn', {})
            console.log("resauth", res)
            const { auth, user }: {
                auth: boolean,
                user: User
            } = res
            setAuth(auth ?? false)
            setUser(user ?? null)
        }
        getLoggedStatus()
    }, [authToken])
    return (
        <div className="">
            {
                auth ?
                    <div className="dropdown group dropdown-end ">
                        <div tabIndex={0} role="button" className=" m-1"> <div className="relative  cursor-pointer bg-slate-700 transition-all duration-800  flex rounded-full items-center  flex justify-end">
                            <div className="group-hover:mx-3 text-white font-bold text-md    scale-0 group-hover:scale-100   transition-[width] duration-600 w-0 group-hover:w-[120px]">
                                <div className="scale-0 group-hover:scale-100 transition-all transform -translate-x-[-50px]  group-hover:translate-x-0 opacity-0 group-hover:opacity-100  duration-500 flex justify-center">
                                    {user.name.length > 15 ? user.name.slice(0, 15) + '...' : user.name}

                                </div>
                            </div>
                            <Avatar name={user.name} src={user?.profileImage} size={45} />
                        </div></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-[230px] overflow-none">
                            <div className="px-4 pt-2 w-full flex flex-col ">
                            <div className="pb-2 text-[15px]">
                                    <span className="font-bold text-white  "> Name</span> : {user.name}
                                </div>
                                <div className=" text-md text-[15px]">
                                    <span className="font-bold text-white "> Email</span> : {user.email!=""?user.email:"Not Provided"}
                                </div>

                            </div>
                            <div className="divider my-1"></div>
                            <li className=""><a onClick={logout} className="text-red-400 hover:bg-red-950 font-bold">Logout</a></li>
                           
                        </ul>
                    </div>

                    :
                    <button className="z-10 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm  text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 p-3 px-4 hover:opacity-70 transition-all duration-200 font-bold " onClick={() =>
                        //@ts-ignore

                        document.getElementById('login_modal').showModal()}>Login</button>

            }
            <dialog id="login_modal" className="modal">
                <div className="modal-box">
                    <Auth />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )

}