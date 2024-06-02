import Image from "next/image"
import Link from "next/link"

function NotFoundPage() {
	return (
		<div className="w-full h-screen max-h-screen">

			<div className="w-full h-[80px] flex items-center px-9">
					<Link href={"/"} className="text-white font-bold text-xl">
						COURSECRAFTER
					</Link>
			</div>
			<div className=" w-full h-[calc(100vh-80px)] flex justify-center items-center ">

				<div>
					<Image
						src="/error-404.png"
						alt="404"
						width={300}
						height={300}
						className="m-3"
					/>
				</div>
				<div className="ml-5" >
					<div className="text-5xl text-white font-bold">

						Oops, Page Not Found
					</div>
					<div className="font-bold my-3">
						The page you are searching for doesnt exist
					</div>
					<div className="pt-3">
						<Link
							className="bg-gradient-full p-3 rounded-lg text-white font-bold hover:bg-gradient-secondary transition-all duration-300"
							href={"/"}
						>
							Back to Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NotFoundPage