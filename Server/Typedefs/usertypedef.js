import { gql } from "apollo-server";

const userType = gql`
	type Query {
		getUser(uid: ID!): User
	}
	type Mutation {
		adduser(token: String!): String
		logout: String
		refresh(token: String!): String
	}

	type User {
		Name: String
		Email: String
		Phone: Int
		UID: ID!
	}
`;

export default userType;
