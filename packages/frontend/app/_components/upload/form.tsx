import UploadPPTs from "./uploadppt";



export default function UploadForm() {

    return (

        <div className="w-full ">

            <div className="w-full flex flex-col justify-center items-center">
                <ul className="steps steps-horizontal ">
                    <li className="step step-primary">Upload your docs</li>
                    <li className="step step-primary">Upload Previous Year papers</li>
                    <li className="step">Start generating</li>
                </ul>
            </div>

            <div>
            <UploadPPTs/>

            </div>



            <div className="modal-action ">
                <form method="dialog">

                    <button className="btn">Close</button>
                </form>
            </div>




        </div>
    )


}