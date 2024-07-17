"use client";

import app from "@/Firebase";
import {
	getAuth,
	RecaptchaVerifier,
	signInWithPhoneNumber,
} from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authContext } from "@/Context/Auth";
import { useDispatch } from "react-redux";
import { update } from "@/Redux/Authenticator";

export default function page() {
	const [conf, setconf] = useState(null);
	const [otp, setotp] = useState(null);
	const otpref = useRef(null);
	const auth = getAuth(app);
	const router = useRouter();
	const dispatch = useDispatch();

	const getOtp = (e) => {
		e.preventDefault();
		otpref.current.setAttribute("hidden", true);

		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		let otp = "";
		for (const key in data) {
			otp += data[key];
		}

		otp = Number(otp);

		setotp(otp);
	};

	async function login(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const phone = Object.fromEntries(formData.entries()).phone;
		let cleanedPhoneNumber = phone.replace(/\D/g, "");
		if (cleanedPhoneNumber.length === 10) {
			cleanedPhoneNumber = `+91${cleanedPhoneNumber}`;
		}

		try {
			window.recaptchaVerifier = new RecaptchaVerifier(
				auth,
				"recaptcha-container",
				{
					size: "normal",
					callback: async () => {
						await signInWithPhoneNumber(
							auth,
							cleanedPhoneNumber,
							window.recaptchaVerifier
						).then((confirmationResult) => {
							window.confirmationResult = confirmationResult;

							setconf(confirmationResult);
						});

						otpref.current.removeAttribute("hidden");
					},
					"expired-callback": () => {},
				}
			);
			window.recaptchaVerifier.render();
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		if (conf) {
			conf
				.confirm(otp)
				.then((res) => {
					res.user.getIdToken().then((token) => {
						fetch(`http://localhost:8000/Users/adduser/${res.user.uid}`, {
							method: "POST",
							headers: {
								token: token,
								"Content-Type": "application/json",
							},
						})
							.then((res) => {
								return res.json();
							})
							.then((res) => {
								dispatch(update(JSON.stringify(res)));
								router.push("/Account");
							})
							.catch((err) => {
								console.log(err);
							});
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [otp]);

	return (
		<div className="my-10">
			<div ref={otpref} hidden>
				<div
					id="default-modal"
					tabindex="-1"
					aria-hidden="true"
					class=" overflow-y-auto overflow-x-hidden flex justify-center fixed top-0 right-0 left-0 z-50  items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
					<div class=" p-4 w-full max-w-2xl max-h-full ">
						<div class="relative bg-white rounded-lg shadow blue">
							<div class="flex items-center justify-between p-4 md:p-5 rounded-t ">
								<h3 class="text-xl font-semibold text-gray-900 ">
									Phone number verification
								</h3>
								<button
									type="button"
									class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
									data-modal-hide="default-modal">
									<svg
										class="w-3 h-3"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 14 14">
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
										/>
									</svg>
									<span class="sr-only">Close modal</span>
								</button>
							</div>
							<div class="p-4 md:p-5 space-y-4 ">
								<form class="max-w-sm mx-auto " onSubmit={getOtp}>
									<div class="flex justify-center mb-2 space-x-2 rtl:space-x-reverse">
										<div>
											<label for="code-1" class="sr-only">
												First code
											</label>
											<input
												type="text"
												maxlength="1"
												data-focus-input-init
												data-focus-input-next="code-2"
												name="code-1"
												class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
												required
											/>
										</div>
										<div>
											<label for="code-2" class="sr-only">
												Second code
											</label>
											<input
												type="text"
												maxlength="1"
												data-focus-input-init
												data-focus-input-prev="code-1"
												data-focus-input-next="code-3"
												name="code-2"
												class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
												required
											/>
										</div>
										<div>
											<label for="code-3" class="sr-only">
												Third code
											</label>
											<input
												type="text"
												maxlength="1"
												data-focus-input-init
												data-focus-input-prev="code-2"
												data-focus-input-next="code-4"
												name="code-3"
												class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
												required
											/>
										</div>
										<div>
											<label for="code-4" class="sr-only">
												Fourth code
											</label>
											<input
												type="text"
												maxlength="1"
												data-focus-input-init
												data-focus-input-prev="code-3"
												data-focus-input-next="code-5"
												name="code-4"
												class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
												required
											/>
										</div>
										<div>
											<label for="code-5" class="sr-only">
												Fifth code
											</label>
											<input
												type="text"
												maxlength="1"
												data-focus-input-init
												data-focus-input-prev="code-4"
												data-focus-input-next="code-6"
												name="code-5"
												class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
												required
											/>
										</div>
										<div>
											<label for="code-6" class="sr-only">
												Sixth code
											</label>
											<input
												type="text"
												maxlength="1"
												data-focus-input-init
												data-focus-input-prev="code-5"
												name="code-6"
												class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 "
												required
											/>
										</div>
									</div>
									<div className="flex justify-center">
										<p
											id="helper-text-explanation"
											class="mt-2 text-sm text-white">
											Please introduce the 6 digit code we sent via number.
										</p>
									</div>
									<div class="flex justify-center p-4 md:p-5  rounded-b ">
										<button
											data-modal-hide="default-modal"
											type="submit"
											class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
											I accept
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
					Sing in
				</h1>
			</div>
			<form
				class="max-w-sm mx-auto light pt-12 px-12 pb-8 rounded-2xl"
				onSubmit={login}>
				<div class="mb-5 ">
					<div className="flex justify-center mb-2">
						<label
							for="email"
							class="block mb-2 text-xl font-semibold  text-[#383896]">
							Enter phone number
						</label>
					</div>
					<input
						type="tel"
						id="phone"
						name="phone"
						class=" bg-white  text-gray-900 text-md rounded-lg  block w-full p-2.5 "
						placeholder="name@flowbite.com"
						required
					/>
				</div>

				<div id="recaptcha-container"></div>

				<div class="flex items-start mb-5">
					<div class="flex items-center h-5">
						<input
							id="terms"
							type="checkbox"
							name="terms"
							value="true"
							class="w-4 h-4 b rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
							required
						/>
					</div>
					<label for="terms" class="ms-2 text-sm font-medium  text-[#383896]">
						I agree with the{" "}
						<a href="#" class="text-black hover:underline ">
							terms and conditions
						</a>
					</label>
				</div>
				<div className="flex justify-center">
					<button
						type="submit"
						class="text-white but focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
						Register new account
					</button>
				</div>
			</form>
		</div>
	);
}
