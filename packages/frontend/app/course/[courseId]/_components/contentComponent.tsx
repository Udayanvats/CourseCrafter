

import { ContentType, TopicList } from '../page'
import Content from './content'

export default function ContentComponent({ data, topicList ,currentTopicIndex,setCurrentTopicIndex,setSubTopicIndex}: {
    data: ContentType[],
    topicList: TopicList[],
    currentTopicIndex:number,
    setCurrentTopicIndex:React.Dispatch<React.SetStateAction<number>>
    setSubTopicIndex:React.Dispatch<React.SetStateAction<number>>
}) {



    return (
        <div className='overflow-y-auto max-h-screen h-[calc(100vh-88px)] p-6 flex flex-col w-full'>
              <div className='w-full flex justify-between mb-6'>
              <button className='btn ' onClick={()=>{
                    setCurrentTopicIndex(Math.max(currentTopicIndex-1,0))
                }}>Previous</button>
                <button className='btn btn-primary' onClick={()=>{
                    setCurrentTopicIndex(Math.min(currentTopicIndex+1,topicList.length-1))
                }}>Next</button>
              
            </div>
            {

                <Content setSubTopicIndex={setSubTopicIndex} topic={topicList[currentTopicIndex]} contents={data?.[currentTopicIndex]}  />

            }

         


        </div>
    )
}