import { ProcessingData } from "./processingCourseComponent"
import ProcessingDataTile from "./processingDataTile";



export default function ProcessingDataTable({ processingData }: { processingData: ProcessingData }) {

    const docs = Object.fromEntries(Object.entries(processingData).filter(([key, value]) => value.type === "doc"));
    const pyqs = Object.fromEntries(Object.entries(processingData).filter(([key, value]) => value.type === "pyq"));
    console.log(docs)
    return (

        <div>
            <div>
                <div className="font-bold">
                    Documents:
                </div>

                <div>
                    {
                        docs && Object.keys(docs).map((filename: string) => {

                            return (
                                <ProcessingDataTile
                                type="doc"
                                    filename={filename}
                                    status={docs[filename]?.status??false}

                                />
                            )
                        }
                        )
                    }
                </div>


            </div>

            <div>
                <div className="font-bold">
                    PYQs:
                </div>

                <div>
                    {
                        pyqs && Object.keys(pyqs).map((filename: string) => {

                            return (
                                <ProcessingDataTile
                                type="pyq"
                                    filename={filename}
                                    status={docs[filename]?.status??false}
                                
                                />
                            )
                        }
                        )
                    }
                </div>


            </div>

        </div>)
}
