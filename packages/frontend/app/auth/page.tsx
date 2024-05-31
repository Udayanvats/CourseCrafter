"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";

export default function CourseCreator() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  // useEffect(() => {
  //     const code = searchParams.get('code')
  //     async function loginWithGoogle() {
  //         await post("loginWithGoogle", JSON.stringify(code))
  //         router.replace("/")
  //         router.refresh()

  //     }
  //     if (code) {
  //         loginWithGoogle()
  //     }
  // }, [])
  const handleRegister = async () => {
    try {
      // Make a POST request to signup endpoint
      const response = await fetch("http://localhost:8080/signup", {
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
        router.push("/");
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
    const response = await fetch("http://localhost:8080/login", {
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
    const res = await fetch("http://localhost:8080/auth/google/url", {
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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center shadow-lg bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Welcome to CourseCrafter
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Convert your PowerPoint presentations into easy-to-understand notes.
          </p>
        </div>
        <div className="rounded-lg bg-white px-10 py-8 shadow-md dark:bg-gray-900 dark:text-gray-50">
          <Tabs className="w-full " defaultValue="login">
            {/* <div className="bg-gray-200 p-2 rounded-lg"> */}
            <TabsList className="grid w-full  grid-cols-2">
              <TabsTrigger
                className="data-[state=active]:bg-white"
                value="login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-white"
                value="signup"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            {/* </div> */}

            <TabsContent value="login">
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
                  <Button
                    className="btn bg-black text-white py-2 w-full"
                    type="submit"
                    onClick={loginWithGoogle}
                  >
                    Google Login
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="signup">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
function userRouter() {
  throw new Error("Function not implemented.");
}
