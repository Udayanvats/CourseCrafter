"use client";
import Button from "../_components/button";
import Buttoncomponent from "../_components/content/buttoncomponent";
import MainContent from "../_components/content/content";
import Header from "../_components/content/header";
import Timeline from "../_components/content/timeline";

export default function Content() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-100 py-4 px-6">
          <div className="flex space-x-4 overflow-x-auto">
          <Buttoncomponent text="Introduction" isSelected={false} isLoading={true}/>
          </div>
        </div>
        <div className="p-8">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="flex ">
              <Timeline isLoading={true} />

              <MainContent isLoading={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
