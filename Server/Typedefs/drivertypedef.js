import { gql } from "apollo-server";

const driverType = gql`
	type Query {
		getShuttleDriver(uid: ID!): Shuttle_Driver
		getCabDriver(uid: ID!): Cab_Driver
	}
	type Mutation {
		addDriver(
			token:String!
			uid: String!
			name: String!
			email: String!
			car: String!
			key: String!
		): String!

		logout: String
	}

	type Driver {
		Name: String
		Email: String
		Phone: Int
		Car_No: String
	}

	type Shuttle_Driver {
		Name: String
		Email: String
		Phone: Int
		UID: ID!
		Shuttle_No: String
		Car_No: String
	}

	type Cab_Driver {
		Name: String

		Email: String

		Phone: Int

		Car_No: String

		UID: ID!
	}
`;

export default driverType;
