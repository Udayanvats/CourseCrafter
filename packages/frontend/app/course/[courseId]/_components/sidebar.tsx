import { TopicList } from "../page"



export default function Sidebar({ topicList ,currentTopicIndex}: {
    topicList: TopicList[],
    currentTopicIndex:number,

}) {
    console.log(topicList[0]?.topic)

    return (
        <div className=" h-screen left-0 top-0 flex  bg-card w-[400px] overflow-y-auto">



            <ul className="steps steps-vertical flex flex-col text-left"> 

                {
                    topicList?.map((topic,index) => (
                        <li 
                        data-content={index<currentTopicIndex ? "✓":index+1} 
                        style={{
                            textAlign:"start"
                        }} className={`step  ${index<=currentTopicIndex && "step-primary"} text-justify break-words hyphens-auto  h-full  text-pretty`}>{(topic.topic).trim()}</li>

                    ))
                }
            </ul>
        </div>

    )

}