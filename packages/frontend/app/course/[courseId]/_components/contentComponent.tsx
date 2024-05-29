

import { post } from '@/api'
import { ContentType, TopicList } from '../page'
import Content from './content'

export default function ContentComponent({courseId, data, topicList, currentTopicIndex, setCurrentTopicIndex, setSubTopicIndex,setProgressData ,pyqContent}: {
    data: ContentType[],
    topicList: TopicList[],
    currentTopicIndex: number,
    setCurrentTopicIndex: React.Dispatch<React.SetStateAction<number>>
    setSubTopicIndex: React.Dispatch<React.SetStateAction<number>>
    courseId: string
    setProgressData: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
    pyqContent: any
}) {

    console.log(pyqContent, "pyqContent")

    return (
        <div className='overflow-y-auto max-h-screen h-[calc(100vh-88px)] p-6 flex flex-col w-full'>

            {

                <Content pyqContent={pyqContent[currentTopicIndex]} setSubTopicIndex={setSubTopicIndex} topic={topicList[currentTopicIndex]} contents={data?.[currentTopicIndex]} />

            }


            {
                data?.[currentTopicIndex] && <div className='w-full flex justify-center mb-6'>
                    <button className='btn mx-3' onClick={() => {
                        setCurrentTopicIndex(Math.max(currentTopicIndex - 1, 0))
                    }}>Previous</button>
                    <button className='btn btn-primary mx-3' onClick={async () => {
                        await post("updateProgress",JSON.stringify({
                            courseId: courseId,
                            topicIndex: currentTopicIndex
                        }))
                        setCurrentTopicIndex(Math.min(currentTopicIndex + 1, topicList.length - 1))
                        setProgressData((prev) => {
                            return {
                                ...prev,
                                [currentTopicIndex]: true
                                }
                            }
                            )
                    }}>Mark as Completed</button>

                </div>
            }
        </div>
    )
}