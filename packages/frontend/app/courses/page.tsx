"use client";
import { Input } from "@/components/ui/input";
import Coursecard from "./_components/coursecard";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PocessingModal from "./_components/modal";
import Table, { Course } from "./_components/table";
import Upload from "../_components/upload";
import { get } from "@/api";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [globalCourses, setGlobalCourses] = useState<Course[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>("");
  useEffect(() => {
    async function getCourses() {
      const data = await get("courses", {});

      if (data) {
        console.log(data, "asdasd");
        setCourses(data);
        setGlobalCourses(data);
      }
    }
    getCourses();
  }, []);

  function searchCourse(query: string) {
    const filteredCourses = globalCourses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setCourses(filteredCourses);
  }

  return (
    <PocessingModal>
      <div className="  w-full text-white">
        <div className=" px-4 mt-4">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <div className="flex justify-between items-center">
            <div className="flex mt-3 items-center min-w-xl ">
              <Input
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value);
                  searchCourse(e.target.value);
                }}
                className=" rounded-full bg-gray-800 w-[700px] max-w-xl focus:outline-none"
                placeholder="Search..."
              />
              <button
                onClick={() => {
                  setCourses(globalCourses);
                  setFilterQuery("");
                }}
                className="ml-3"
              >
                reset
              </button>
              {/* <Input className="flex-1" placeholder="Search..." /> */}
            </div>
            <Upload className="   px-6 rounded-md text-lg font-bold transition-all duration-500 " />
          </div>
        </div>
        <div className=" before:bg-gray-400 after:bg-gray-400 divider  justify-self-center flex justify-center content-center items-center self-center place-self-center"></div>

        <div className="px-4">
          <div className="grid grid-cols-1 gap-6">
            <Table courses={courses} setCourses={setCourses} />
          </div>
        </div>
      </div>
    </PocessingModal>
  );
}
