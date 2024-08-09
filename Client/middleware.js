import { NextResponse } from "next/server";

const cache = new Map();

const auth = async (token) => {
	if (cache.has(token)) {
		return cache.get(token);
	}

	return new Promise((resolve, reject) => {
		fetch("http://localhost:8000/auth/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				cache.set(token, res);
				resolve(res);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export async function middleware(request) {
	const path = request.nextUrl.pathname;
	let user = false;
	let role = null;

	const tokenCookie = request.cookies.get("Token");
	if (tokenCookie) {
		try {
			const res = await auth(tokenCookie.value);
			
			user = res.user;
			role = res.role;
		} catch (error) {
			console.log(error);
		}
	}

	if (path == "/") {
		if (user) {
			if (role != "Rider")
				return NextResponse.redirect(new URL(`/${role}_Driver`, request.url));
		}
	} else if (path == "/Cab_Driver") {
		if (user) {
			if (role == "Rider")
				return NextResponse.redirect(new URL(`/`, request.url));
			else if (role == "Shuttle") {
				return NextResponse.redirect(new URL(`/Shuttle_Driver`, request.url));
			}
		} else {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else if (path == "/Shuttle_Driver") {
		if (user) {
			if (role == "Rider")
				return NextResponse.redirect(new URL(`/`, request.url));
			else if (role == "Cab") {
				return NextResponse.redirect(new URL(`/Cab_Driver`, request.url));
			}
		} else {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else if (path == "/Services") {
		if (user) {
			if (role != "Rider")
				return NextResponse.redirect(new URL(`/${role}_Driver`, request.url));
		} else {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else if (path == "/Signin/User") {
		if (user) {
			if (role != "Rider") {
				return NextResponse.redirect(new URL(`/${role}_Driver`, request.url));
			} else {
				return NextResponse.redirect(new URL("/", request.url));
			}
		}
	} else if (path == "/Signin/Driver") {
		if (user) {
			if (role != "Rider") {
				return NextResponse.redirect(new URL(`/${role}_Driver`, request.url));
			} else {
				return NextResponse.redirect(new URL("/", request.url));
			}
		}
	} else if (path == "/Account") {
		if (user) {
			if (role != "Rider") {
				return NextResponse.redirect(new URL(`/${role}_Driver`, request.url));
			}
		} else {
			return NextResponse.redirect(new URL(`/`, request.url));
		}
	} else if (path == "/Driver_Form") {
		if (user) {
			if (role == "Rider") {
				return NextResponse.redirect(new URL(`/`, request.url));
			}
		}
	}
}
