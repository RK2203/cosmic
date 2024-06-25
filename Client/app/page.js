"use client";

import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	return (
		<div>
			<div className="flex justify-center mt-10">
				<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-[#383896] ">
					Suggestions
				</h1>
			</div>
			<div class="grid grid-cols-4 gap-20 mx-20 mt-24">
				<div>
					<img class="h-40 max-w-full rounded-lg" src="cab.avif" alt="" />
					<div className="flex justify-center mt-2 ">
						<h1>Wanna take a ride?</h1>
					</div>
				</div>
				<div
					onClick={() => {
						router.push("/Services/Shuttle");
					}}>
					<img class="h-40 max-w-full rounded-lg" src="shuttle.jpeg" alt="" />
					<div className="flex justify-center mt-2 ">
						<h1>Late for office?</h1>
					</div>
				</div>
				<div>
					<img class="h-40 max-w-full rounded-lg" src="rent.jpeg" alt="" />
					<div className="flex justify-center mt-2 ">
						<h1>Going for trip?</h1>
					</div>
				</div>
				<div>
					<img class="h-40 max-w-full rounded-lg" src="cour.png" alt="" />
					<div className="flex justify-center mt-2 ">
						<h1>Want to send someone gift?</h1>
					</div>
				</div>
			</div>

			<section class=" mt-10 mx-20">
				<div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
					<img
						class="w-full dark:hidden"
						src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
						alt="dashboard image"
					/>
					<img
						class="w-full hidden dark:block rounded-xl"
						src="taxi.jpg"
						alt="dashboard image"
					/>
					<div class="mt-4 md:mt-0">
						<h2 class="mb-4 text-4xl tracking-tight font-extrabold text-[#383896]">
							Book your ride whenever you want
						</h2>
						<p class="mb-6 font-light text-black md:text-lg ">
							Our most efficient drivers are ready to pick you up at any time
							any where you want
						</p>
						<a
							href="#"
							class="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900">
							Get started
							<svg
								class="ml-2 -mr-1 w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
