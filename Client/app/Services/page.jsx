import React from "react";

export default function Services() {
	return (
		<div>
			<div className="flex justify-center mt-10">
				<h1 class=" text-4xl font-extrabold leading-none tracking-tight text-[#383896] ">
					Services for you
				</h1>
			</div>
			<div class="grid mx-20 grid-cols-4 mt-12 gap-10">
				<div>
					<img
						class="h-auto max-w-full rounded-lg"
						src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
						alt=""
					/>
				</div>
				<div>
					<img
						class="h-auto max-w-full rounded-lg"
						src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
						alt=""
					/>
				</div>
				<div>
					<img
						class="h-auto max-w-full rounded-lg"
						src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
						alt=""
					/>
				</div>
				<div>
					<img
						class="h-auto max-w-full rounded-lg"
						src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg"
						alt=""
					/>
				</div>
			</div>
		</div>
	);
}
