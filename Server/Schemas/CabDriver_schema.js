import mongoose from "mongoose";
const { Schema } = mongoose;

const cabDriverSchema = new Schema({
	Name: String,
	Email: String,

	Phone: Number,

	Car_No: String,

	UID: String,

	Trips: Array,
});

mongoose.models = {};

export default mongoose.model("CabDrivers", cabDriverSchema);
