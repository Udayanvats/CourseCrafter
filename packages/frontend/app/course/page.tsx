"use client";
import { Input } from "@/components/ui/input";
import Coursecard from "../_components/course/coursecard";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const formData = new FormData();
        formData.append("userId", "2");

        const response = await fetch("http://localhost:8080/courses", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const responseData = await response.json();

        console.log(responseData);
        setCourses(responseData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
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
          {courses.map((course) => (
            <Coursecard
              key={course.userId}
              topic={course.title}
              status={true}
              username="anurag"
            />
          ))}
          <Coursecard
            topic="Introduction to Web Development"
            status={true}
            username="anurag"
          />
        </div>
      </div>
    </div>
  );
}
