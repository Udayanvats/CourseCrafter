
"use client"

export default function Details({ setTitle, setMode, mode, title }: {
    setTitle: Function,
    setMode: Function,
    mode: number,
    title: string

}

) {

  


    return (
        <div className="h-full w-full min-h-[40vh] py-9 flex">
            <div className="w-full">

                <div>
                    <div className="mb-2 font-bold">
                        Title
                    </div>
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Type here" className="input w-full max-w-xs input-bordered  focus:outline-none" />
                </div>

            </div>
            <div className="w-full">

                <div>
                    <div className="font-bold">Selct Mode</div>
                    <div >
                        <div className="flex mt-5" >
                            <input checked={mode===0} onClick={() => setMode(0)} type="radio" name="radio-1" className="radio mr-4" />
                            <div className="mr-4" >
                                Easy
                            </div>
                        </div>
                        <div className="flex mt-2">
                            <input checked={mode===1} onClick={() => setMode(1)} type="radio" name="radio-1" className="radio mr-4" />
                            <div className="mr-4" >
                                Detailed
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )

}