import { gql } from "apollo-server";

const userType = gql`
	type Query {
		getUser(uid: ID!): User
	}
	type Mutation {
		adduser(name: String!, uid: String!, email: String!, image: String!): String
		logout: String
		setCookie(token: String!): String
	}

	type User {
		Name: String
		Email: String
		Phone: Int
		Image: String
		UID: ID!
	}
`;

export default userType;
