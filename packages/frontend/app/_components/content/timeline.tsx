"use client";
import CirclecontentSkeleton from "../skeleton/circlecontent";
import TimelineItem from "./timelineitem";
interface CirclecontentSkeletonProps {
  isLoading: boolean;
}
const Timeline = ({ isLoading }: CirclecontentSkeletonProps) => {
  return (
    <div className="w-1/3 bg-gray-100 rounded-l-lg p-6 ">
      <h2 className="text-2xl font-bold mb-4">Timeline</h2>
      <div className="space-y-4">
        {{ isLoading } ? (
          <CirclecontentSkeleton />
        ) : (
          <TimelineItem
            number={1}
            title="Introduction"
            description="Overview of web development"
          />
        )}
      </div>
    </div>
  );
};

export default Timeline;
