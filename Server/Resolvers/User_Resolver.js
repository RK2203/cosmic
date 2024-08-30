import { addNewUser } from "../Handlers/User_Handler.js";
import { getAUser } from "../Handlers/User_Handler.js";

const userResolver = {
	Mutation: {
		adduser: async (parent, arg, { req, res }) => {
			try {
				const { name, email, uid } = arg;

				const res = await addNewUser(name, email, uid);

				return res;
			} catch (error) {
				console.log(error);

				return "Internal server error";
			}
		},
	},

	Query: {
		getUser: async (parent, arg, { req, res }) => {
			try {
				const user = await getAUser(arg.uid);

				return user;
			} catch (error) {
				return "Internal server error";
			}
		},
	},
};
export default userResolver;
