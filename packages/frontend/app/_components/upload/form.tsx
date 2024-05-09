"use client";
import { useState } from "react";
import UploadPPTs from "./uploadppt";
import { UploadProps } from ".";
import { AnimatePresence, motion } from "framer-motion";
import UploadPYQs from "./uploadpyqs";
import Details from "./details";
import { useRouter } from "next/navigation";

export default function UploadForm({
  uploadFormData,
  setUploadFormData,
}: {
  uploadFormData: UploadProps;
  setUploadFormData: Function;
}) {
  const router = useRouter();
  const [current, setCurrrent] = useState(0);

  function next() {
    if (current === 2) {
      //generate
      upload();
      console.log(uploadFormData);
    }
    setCurrrent((prev: number) => Math.min(prev + 1, 2));
  }

  function prev() {
    setCurrrent((prev: number) => Math.max(prev - 1, 0));
  }

  async function upload() {
    const formData = new FormData();
    uploadFormData.docs.forEach((doc: File) => {
      formData.append("docs", doc);
    });
    uploadFormData.pyqs.forEach((doc: File) => {
      formData.append("pyqs", doc);
    });
    formData.append("mode", uploadFormData.mode.toString());
    formData.append("title", uploadFormData.title);
    formData.append("userId", "a1df4b0b-2ed9-4245-b74c-b60728640a93");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const res = await response.json();

      console.log("file uploaded successfully");
      router.push(`/courses?courseId=${res?.courseId}`);
    } else {
      console.log("file upload failed");
    }

    console.log(response, "bodyyyyy");

    // router.push("/dashboard",{

    // })
  }

  console.log(current);
  return (
    <div className="w-full p-3 py-4 min-h-[50vh] h-full ">
      <div className="w-full flex flex-col justify-center items-center">
        <ul className="steps steps-horizontal ">
          <li className={`step  ${current >= 0 && "step-primary"} `}>
            Upload your docs
          </li>
          <li className={`step  ${current >= 1 && "step-primary"} `}>
            Upload Previous Year papers
          </li>
          <li className={`step  ${current >= 2 && "step-primary"} `}>
            Start generating
          </li>
        </ul>
      </div>

      <div className="overflow overflow-hidden h-full">
        <AnimatePresence mode="wait">
          {current === 0 ? (
            <motion.div
              exit={{
                x: -200,
                // scale:0.7,
                opacity: 0,
              }}
              key={"upload-ppts"}
              initial={{
                x: 200,
                // scale:0.7,
                opacity: 0,
              }}
              animate={{
                x: 0,
                // scale:1,
                opacity: 1,
                //
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <UploadPPTs
                docs={uploadFormData.docs}
                setDocs={(files: Array<File>) => {
                  setUploadFormData((prev: UploadProps) => ({
                    ...prev,
                    docs: files,
                  }));
                  console.log(files, "files");
                }}
              />
            </motion.div>
          ) : current === 1 ? (
            <motion.div
              exit={{
                x: -200,
                // scale:0.7,
                opacity: 0,
              }}
              key={"upload-pyqs"}
              initial={{
                x: 200,
                // scale:0.7
                opacity: 0,
              }}
              animate={{
                x: 0,
                // scale:1,
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <UploadPYQs
                docs={uploadFormData.pyqs}
                setDocs={(files: Array<File>) => {
                  setUploadFormData((prev: UploadProps) => ({
                    ...prev,
                    pyqs: files,
                  }));
                  console.log(files, "files");
                }}
              />
            </motion.div>
          ) : current === 2 ? (
            <motion.div
              exit={{
                x: -200,
              }}
              key={"start-generating"}
              initial={{
                x: 200,
              }}
              animate={{
                x: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="h-full w-full"
            >
              <Details
                mode={uploadFormData.mode}
                title={uploadFormData.title}
                setMode={(mode: number) =>
                  setUploadFormData((prev: UploadProps) => ({
                    ...prev,
                    mode: mode,
                  }))
                }
                setTitle={(title: string) =>
                  setUploadFormData((prev: UploadProps) => ({
                    ...prev,
                    title: title,
                  }))
                }
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-row justify-between w-full ">
        <button
          className="btn btn-neutral"
          onClick={() => {
            prev();
          }}
        >
          Previous
        </button>
        <button
          className={`btn ${current < 2 ? "btn-primary" : "btn-secondary"}`}
          onClick={() => {
            next();
          }}
        >
          {
            current < 2 ? "Next" : "Generate"
            // "Next"
          }
        </button>
      </div>

      {/* <div className="modal-action ">
                <form method="dialog">

                    <button className="btn">Close</button>
                </form>
            </div> */}
    </div>
  );
}
