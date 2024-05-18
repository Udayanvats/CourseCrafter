"use client"

import Auth from "../auth/page"

export default function AuthComponent() {

    return (
        <div>
            <button className="z-10 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm  text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 p-3 px-4 hover:opacity-70 transition-all duration-200 font-bold " onClick={() =>
                //@ts-ignore
                document.getElementById('login_modal').showModal()}>Login</button>
            <dialog id="login_modal" className="modal">
                <div className="modal-box">
                <Auth/>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )

}