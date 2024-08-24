import { gql } from "apollo-server";

const shuttle_type = gql`
	type Query {
		getShuttle(Lat: Float!, Long: Float!): [Shuttles!]
	}

	type Shuttles {
		Starting: String!
		Destination: String!
	}
`;

export default shuttle_type;
