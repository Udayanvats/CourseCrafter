
"use client"

import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";


export default function UploadPPTs() {

    const onDrop = async (acceptedFiles: Array<File>) => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/upload`, {
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
        <div className="w-full flex my-9">

            <div {...getRootProps()} className="">
                <label className="block border-2 border-dashed border-gray-600 p-8 rounded-lg text-center cursor-pointer flex flex-col items-center">
                <FaCloudUploadAlt className="fill-primary" size={80} />

                    <p className="text-lg">Upload your Presentation by clicking here</p>
                </label>
                <input
                    {...getInputProps()}
                    className="hidden"
                    id="upload" // Match this with the htmlFor attribute of the label
                    type="file"
                />
            </div>
            <div>

            </div>
        </div>
    )
}