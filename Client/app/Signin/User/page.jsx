"use client";

import app from "@/Firebase";
import {
	getAuth,
	RecaptchaVerifier,
	signInWithPhoneNumber,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { update } from "@/Redux/Authenticator";
import { gql, useMutation } from "@apollo/client";
import { getDatabase, ref, set } from "firebase/database";
import { authContext, useAuth } from "@/Context/Auth";
import { ProgressSpinner } from "primereact/progressspinner";
import { useApolloClients } from "@/Context/Apollo";

const db = getDatabase(app);

export default function page() {
	const query = gql`
		mutation addUser($token: String!) {
			adduser(token: $token)
		}
	`;
	const [conf, setconf] = useState(null);
	const [otp, setotp] = useState(null);
	const [loader, setloader] = useState(false);
	const { client1 } = useApolloClients();

	const [adduser] = useMutation(query, { client: client1 });
	const otpref = useRef(null);
	const auth = getAuth(app);
	const router = useRouter();
	const dispatch = useDispatch();
	const { loading, user, role } = useAuth();

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
						)
							.then((confirmationResult) => {
								window.confirmationResult = confirmationResult;

								setconf(confirmationResult);
								otpref.current.removeAttribute("hidden");
							})
							.catch((err) => {
								console.log(err);
							});
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

	async function Login() {
		const provider = new GoogleAuthProvider();

		await signInWithPopup(auth, provider)
			.then(async (res) => {
				setloader(true);
				res.user.getIdToken().then(async (token) => {
					const response = await adduser({
						variables: { token: token },
					});

					try {
						await set(ref(db, "Roles/" + res.user.uid), {
							Role: "Rider",
						});
						router.push("/Account");
					} catch (error) {
						console.log(error);
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	if (loading) {
		return <div>Loading....</div>;
	}

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

			{/* Spinner */}
			{loader && (
				<div className="flex justify-center mt-48">
					<ProgressSpinner />
				</div>
			)}

			{!loader && (
				<>
					<div className="flex justify-center">
						<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
							Sing in
						</h1>
					</div>
					<div className=" light pt-12 px-12 pb-8 rounded-2xl max-w-sm mx-auto">
						<form class="" onSubmit={login}>
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
								<label
									for="terms"
									class="ms-2 text-sm font-medium  text-[#383896]">
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
						<div className="flex justify-center mt-3">
							<button
								onClick={Login}
								class="flex items-center justify-center max-w-xs px-6 py-2 text-sm font-bold text-center text-gray-700 uppercase transition-all duration-600 ease-linear bg-white border border-gray-400 rounded-lg gap-3 hover:scale-105">
								<svg
									class="h-6"
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="xMidYMid"
									viewBox="0 0 256 262">
									<path
										fill="#4285F4"
										d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
									<path
										fill="#34A853"
										d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
									<path
										fill="#FBBC05"
										d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
									<path
										fill="#EB4335"
										d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
								</svg>
								Continue with Google
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
