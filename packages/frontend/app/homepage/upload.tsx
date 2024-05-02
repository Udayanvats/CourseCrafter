"use client";
import React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadProps {
  onUpload: (files: File[]) => void;
}

function Upload({ onUpload }: UploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="">
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Click here to upload</p>
      </div>
    </div>
  );
}

export default Upload;
