
import { Input } from "@/components/ui/input";
import Coursecard from "./_components/coursecard";
import React from "react";
import { Button } from "@/components/ui/button";
import PocessingModal from "./_components/modal";
import Table from "./_components/table";
import Upload from "../_components/upload";

export default function Courses() {
  return (
    <PocessingModal>
      <div className="bg-background min-h-screen text-white">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <div className="flex space-x-2 mt-3">
            <Input className="flex-1" placeholder="Search..." />
            {/* <Input className="flex-1" placeholder="Search..." /> */}
            <Button className="text-white" variant="outline">
              X
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              <Button
                className="px-4 py-2 rounded-md text-white"
                variant="outline"
              >
                All
              </Button>
              <Button
                className="px-4 py-2 rounded-md text-white"
                variant="outline"
              >
                Liked
              </Button>
              <Button
                className="px-4 py-2 rounded-md text-white"
                variant="outline"
              >
                Published
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6">

            <Table />
          </div>
        </div>
       <Upload className="absolute right-12 bottom-9  bg-primary  px-6 rounded-xl text-lg font-bold " />
      </div>
   
    </PocessingModal>
  );
}
