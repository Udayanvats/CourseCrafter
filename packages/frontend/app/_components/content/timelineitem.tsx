"use client"
interface TimelineItemProps {
  number: number;
  title: string;
  description: string;
}

const TimelineItem= ({ number, title, description }: TimelineItemProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default TimelineItem;
