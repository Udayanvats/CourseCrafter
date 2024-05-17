// import { env } from "process"

import { redirect } from "next/navigation"
import { toast } from "react-toastify"


export const post = async (url: string, data: any, headers = {}, serverHeaders: any = null) => {
    try {


        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
            method: "POST",
            headers: serverHeaders ? serverHeaders : {
                ...headers

            },
            body: data,
            credentials: 'include',
            cache: "no-store"

        })
        
        const resp= await res.json()
        if(resp?.authError){
            // redirect("/auth")
            
           

        }
        if(resp?.error){
            throw new Error(resp.error)
        }
        return resp
    }
    catch (error : any) {
        console.log('error',error)
        toast.error(error.message)
        // throw error
    }
}

export const get = async (url: string, headers = {}, serverHeaders: any = null) => {
    try{
        console.log('getrrr', process.env.NEXT_PUBLIC_BACKEND_URL)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
            method: "GET",
            headers: serverHeaders ? serverHeaders : {
                "Content-Type": "application/json",
                ...headers
    
            },
            credentials: 'include',
            cache: "no-cache"
        })
        const resp= await res.json()
        // if(resp?.authError){
        //     redirect("/auth")
        // }
        if(resp?.error){
            throw new Error(resp.error)
        }
        return resp;
    }
    catch(error:any){
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`,error.message)
        toast.error(error.message)
        // throw error
    }
   
}