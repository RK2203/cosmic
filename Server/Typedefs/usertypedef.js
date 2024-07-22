import { gql } from "apollo-server";

const userType = gql`
	type Query {
		getuser: [User]
	}
	type Mutation {
		adduser(token: String!): User
	}

	type User {
		Name: String
		Email: String
		Phone: Int
		UID: ID!
	}
`;

export default userType;
