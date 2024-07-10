import mongoose from "mongoose";
const { Schema } = mongoose;

const shuttleDriverSchema = new Schema({
	Name: String,
	Email: String,

	Phone: Number,

	Car_No: String,

	Shutttle_No: String,

	UID: String,

	Passengers: Array,
});

mongoose.models = {};

export default mongoose.model("ShuttleDrivers", shuttleDriverSchema);
