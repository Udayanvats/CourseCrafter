"use client";
import { Input } from "@/components/ui/input";
import Coursecard from "../_components/course/coursecard";
import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import PocessingModal from "./_components/modal";



export default function Courses(){
   
    // document.getElementById('my_modal_3').showModal()
    return (

        <PocessingModal>
 <div className="bg-white min-h-screen text-black">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <div className="flex space-x-2 mt-3">
          <Input className="flex-1" placeholder="Search..." />
          {/* <Input className="flex-1" placeholder="Search..." /> */}
          <Button className="text-black" variant="outline">
            X
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            <Button
              className="px-4 py-2 rounded-md text-black"
              variant="outline"
            >
              All
            </Button>
            <Button
              className="px-4 py-2 rounded-md text-black"
              variant="outline"
            >
              Liked
            </Button>
            <Button
              className="px-4 py-2 rounded-md text-black"
              variant="outline"
            >
              Published
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-6">
          <Coursecard
            topic="Introduction to Web Development"
            status={true}
            username="anurag"
          />
        </div>
      </div>
    </div>
            </PocessingModal>



    )
}