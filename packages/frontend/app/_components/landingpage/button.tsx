"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { get } from "@/api";

const GetStartedButton = () => {
  const router = useRouter()

  return (
    <button
      onClick={async () => {
        const res = await get("isLoggedIn", {});
      
        const { auth } = res;
        if (!auth) {
          //@ts-ignore
          document.getElementById("login_modal").showModal()
        }
        else {
          router.push('/courses')
        }
      }}
      className=" z-10 p-[3px] relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        Get Started
      </div>
    </button>
  );
};

export default GetStartedButton;
