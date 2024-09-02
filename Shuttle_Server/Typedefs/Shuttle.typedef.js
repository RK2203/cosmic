import { gql } from "apollo-server";

const shuttleData_type = gql`
	type Query {
		getShuttleData(Start: String!, Dest: String!, Time: String!): [Shuttles]
	}

	type Shuttles {
		Seat: Int
		Shuttle_id: String
		Starting: String
		Destination: String
		Start_time: String
		Dest_time: String
		Fare: Int
		PickupTime: String
		DropTime: String
	}
`;

export default shuttleData_type;
