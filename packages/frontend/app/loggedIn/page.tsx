"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function LoggedIn(){
    const router=useRouter()
    const searchParams = useSearchParams()
    useEffect(() => {
        const code = searchParams.get('code')
        // JSON.stringify(code)
        async function loginWithGoogle() {
            const res=await fetch("http://localhost:8080/auth/google/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
                cache: "no-store",
                credentials: "include",
          
              })

              if(res.ok){
                  console.log("logged in")
                   router.replace("/")
            router.refresh()
              }
           

        }
        if (code) {
            loginWithGoogle()
        }
    }, [])
    return (
        <div>
            <h1>Logged In</h1>
        </div>
    )
}