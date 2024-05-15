import { TopicList } from "../page"



export default function Sidebar({ topicList, currentTopicIndex, setCurrentTopicIndex ,subTopicIndex,setSubTopicIndex}: {
    topicList: TopicList[],
    currentTopicIndex: number,
    setCurrentTopicIndex: React.Dispatch<React.SetStateAction<number>>
    subTopicIndex: number
    setSubTopicIndex: React.Dispatch<React.SetStateAction<number>>


}) {
    console.log(currentTopicIndex, "currentTopicIndex")

    return (
        <div className=" h-[calc(100vh-88px)] left-0 top-0 flex  w-[350px] overflow-y-auto flex-col p-3 ">



            <div className="mt-5 text-white font-bold mb-5 pl-3 ">

                On this page
            </div>
            <div>
                <ul className="menu  w-full rounded-box">


                    {
                        topicList?.map((topic, index) => (


                            <li
                                className="relative"
                               
                            >
                                <input  onClick={() => {
                                    setCurrentTopicIndex(index)
                                    setSubTopicIndex(0)
                                }}
                                 type="radio" name="radio-1" className="radio absolute w-full h-10 opacity-0 " />

                                <details open={currentTopicIndex === index} >
                                    <summary onClick={() => {

                                    }}>{topic.topic}</summary>
                                    <ul className="border-slate-600 border-l ">

                                        {
                                            topic.subtopics?.map((subtopic,subindex) => (
                                                <li onClick={()=>{
                                                    setSubTopicIndex(subindex)
                                                    document?.getElementById(subindex.toString())?.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'center',
                                                        inline: 'center'
                                                    })
                                                }} className="w-full active "> <a className={`${subTopicIndex===subindex&&"active"}`}>{subtopic}</a></li>
                                            ))
                                        }
                                    </ul>
                                </details>
                            </li>

                        ))
                    }



                </ul>
            </div>
        </div>

    )

}