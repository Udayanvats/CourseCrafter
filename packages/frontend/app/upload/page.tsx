"use client";
import React from "react";
import { useDropzone } from "react-dropzone";

const UploadPage = () => {
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    try {
      const response = await fetch("https://localhost/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("File uploaded successfully.");
        // Handle success
      } else {
        console.error("File upload failed.");
        // Handle failure
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Upload your PPT to convert it into a course
      </h1>
      <div {...getRootProps()} className="">
        <label className="block border-2 border-dashed border-gray-400 p-8 text-center cursor-pointer">
          <img
            src="/upload-icon.png"
            alt="Upload Icon"
            className="mx-auto mb-4"
            style={{ width: "50px", height: "50px" }}
          />
          <p className="text-lg">Upload your Presentation by clicking here</p>
        </label>
        <input
          {...getInputProps()}
          className="hidden"
          id="upload" // Match this with the htmlFor attribute of the label
          type="file"
        />
      </div>
    </div>
  );
};

export default UploadPage;
