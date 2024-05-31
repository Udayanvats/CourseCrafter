import React, { useRef, useEffect } from "react";
import { ContentType } from "../page";



interface TopicList {
    topic?: string;
    subtopics?: string[];
}

interface ContentProps {
    topic: TopicList;
    contents?: ContentType|null;
    setSubTopicIndex: React.Dispatch<React.SetStateAction<number>>;
    
}

export default function Content({ contents, topic ,setSubTopicIndex}: ContentProps) {
    const divRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "50px",
            threshold: 0.5 // Adjust the threshold as needed
        };

        const observer = new IntersectionObserver((entries) => {
            // console.log(entries[0].target.id,"asd");
    
                    const index = parseInt(entries[0].target.id);
                    // yourFunction(index);
                    console.log(`Div with index ${index} is in view`);


     
        
        },options);

        divRefs.current.forEach(div => {
            if (div) {
                observer.observe(div);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [contents]);

    const yourFunction = (index: number) => {
        console.log(`Div with index ${index} is in view`);
       
    };

    console.log(contents, "contents")

    return (
        <div className="w-full">
            <div className='text-4xl font-extrabold text-white mb-8'>
                {topic?.topic}
            </div>

            {contents?.Introduction &&
                <div className="mb-6  ">
                    <div className="font-bold text-white text-xl mb-2 ">
                        Introduction :
                    </div>
                    <div className="mb-3 pl-3">
                        {contents?.Introduction}
                    </div>
                </div>
            }

            <div className="mb-3 ">
                {contents?.Content?.map((content, index) => {
                    return (
                        <div id={index.toString()} key={index} ref={(el: HTMLDivElement | null) => { divRefs.current[index] = el; }} className="mb-6">
                            <div   className="text-lg font-bold mb-3 ">
                                {topic?.subtopics?.[index]} 
                            </div>
                            <div className={`my-2 pl-3 text-base`}>
                                {content}
                            </div>
                        </div>
                    )
                })}
            </div>

            {contents?.Conclusion &&
                <div className="mb-3">
                    <div className="font-bold text-white text-xl">
                        Conclusion :-
                    </div>
                    <div className="my-2 pl-3">
                        {contents?.Conclusion}
                    </div>
                </div>
            }
        </div>
    );
}
