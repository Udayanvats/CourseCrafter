"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion"
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Suspense } from 'react'


export function AuthComponent() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    // const searchParams = useSearchParams();
    const tabs = ["login", "signup"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const searchParams = useSearchParams()
    useEffect(() => {
        const code = searchParams.get("code");

        async function loginWithGoogle() {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                    cache: "no-store",
                    credentials: "include",
                }
            );

            if (res.ok) {
                console.log("logged in");
                router.replace("/courses");
                router.refresh();
            } else {
                console.error("Failed to log in");
                // Handle error here, e.g., show a message to the user
            }
        }

        if (code) {
            loginWithGoogle();
        }
    }, [searchParams, router]);
    const handleRegister = async () => {
        try {
            // Make a POST request to signup endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }), // Send name, email, and password in request body
                credentials: "include",
                cache: "no-store",
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                router.back()
            } else {
                // Handle error response (e.g., display error message)
                console.error("Signup failed");
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error occurred:", error);
        }
    };

    const handleLogin = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            router.push("/");
        } else {
            console.error("Login failed");
        }
    };
    // const router = useRouter();

    const loginWithGoogle = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/url`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data, data.url);
            router.push(data.url);
        }
    };

    return (
        <div className="flex  flex-col items-center justify-start shadow-lg  px-4 py-6  h-[550px]">
            <div className="mx-auto w-full max-w-md  space-y-8 ">
                <div>
                    <h2 className=" text-center text-3xl font-bold tracking-tight text-white dark:text-gray-50">
                        Welcome to CourseCrafter
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400 ">
                        Convert your PowerPoint presentations into easy-to-understand notes.
                    </p>
                </div>
                <div className="rounded-lg  px-10 ">
                    <div className="flex" >
                        <div key={"asd"} onClick={() => {
                            setIsLogin(true)
                        }} className=" w-full mr-3 flex rounded-lg relative  h-12">
                            <div className="flex z-10 text-white w-full h-full justify-center items-center ">
                                Login
                            </div>
                            {isLogin && <motion.div layoutId="tab" className="absolute bg-gradient-secondary h-full w-full rounded-xl" />}
                        </div>
                        <div key={"sdf"} onClick={() => {
                            setIsLogin(false)
                        }} className=" w-full mr-3 flex rounded-lg relative  h-12">
                            <div className="flex z-10 text-white w-full h-full justify-center items-center  ">
                                Sign up
                            </div>

                            {!isLogin && <motion.div layoutId="tab" className="absolute bg-gradient-secondary h-full w-full rounded-xl " />}
                        </div>
                    </div>




                    <div className=" mt-3">
                        {
                            isLogin ? <div className="  flex flex-col  " >
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            autoComplete="email"
                                            id="email"
                                            placeholder="name@example.com"
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            autoComplete="current-password"
                                            id="password"
                                            placeholder="Password"
                                            required
                                            value={password}
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            className="btn text-white py-2 bg-black w-full"
                                            type="submit"
                                            onClick={handleLogin}
                                        >
                                            Sign in
                                        </Button>
                                        <div className="divider">OR</div>
                                        <Button
                                            className="btn bg-gray-200 text-black font-bold py-2 w-full flex space-around hover:bg-gray-700 hover:text-white transition-all duration-500"
                                            type="submit"
                                            onClick={loginWithGoogle}
                                        >
                                            <FcGoogle size={25} className="mr-3" />

                                            Login with Google
                                        </Button>
                                    </div>
                                </div>
                            </div>
                                :
                                <div >
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                autoComplete="name"
                                                id="name"
                                                placeholder="John Doe"
                                                required
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                autoComplete="email"
                                                id="email"
                                                placeholder="name@example.com"
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                autoComplete="new-password"
                                                id="password"
                                                placeholder="Password"
                                                required
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Button
                                                className="btn bg-black text-white py-2 w-full"
                                                type="submit"
                                                onClick={handleRegister}
                                            >
                                                Sign up
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>

                </div>
            </div >


        </div >
    );
}






export default function Auth() {
    return (
        <Suspense>
            <AuthComponent />
        </Suspense>
        )
}
