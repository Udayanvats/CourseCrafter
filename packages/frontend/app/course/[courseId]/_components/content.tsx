import { ContentType, TopicList } from "../page"




export default function Content({ contents, topic }: {
    topic: TopicList,
    contents: ContentType,

}) {


    return (

        <div className="w-full">
            <div className='text-4xl font-extrabold text-white mb-8'>
                {topic?.topic}
            </div>

            {
                contents?.Introduction &&
                <div className="mb-3 text-xl ">
                    <div className="font-bold text-white">

                        Introduction :
                    </div>
                    <div className="mb-3 font-bold">

                        {contents?.Introduction}
                    </div>
                </div>
            }

            <div className="mb-3">
                {
                    contents?.Content?.map((content, index) => {
                        return (
                            <div>
                                <div className="text-lg font-bold">
                                    {topic?.subtopics[index]}
                                </div>
                                <div className="my-2">
                                    {content}
                                </div>
                            </div>
                        )
                    })

                }
            </div>
            {
                contents?.Conclusion &&
                <div className="mb-3">
                    <div className="font-bold text-white">
                        Conclusion :-
                    </div>
                    <div className="my-2">

                        {contents?.Conclusion}
                    </div>
                </div>
            }

        </div>


    )
}