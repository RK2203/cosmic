import cookie from "cookie";

const cookieResolver = {
	Mutation: {
		setCookie: async (parent, args, { req, res }) => {
			const tokenCookie = cookie.serialize("Token", args.token, {
				maxAge: 10 * 365 * 24 * 60 * 60,
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});

			res.setHeader("Set-Cookie", [tokenCookie]);

			return "Cookie updated";
		},

		logout: async (parent, args, { req, res }) => {
			const tokenCookie = cookie.serialize("Token", null, {
				maxAge: 0,
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});

			res.setHeader("Set-Cookie", [tokenCookie]);

			return "Logged out";
		},
	},
};

export default cookieResolver;
