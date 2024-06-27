import mongoose from "mongoose";
const { Schema } = mongoose;

const shuttleSchema = new Schema({
	Code: String,
	Starting: String,
	Destination: String,
	Time_of_deperture: String,
	Time_of_arrival: String,
	Passangers: Array,
	Stopages: Array,
	Fare:Number,
	Day:String,
	Seat:Number
});

mongoose.models = {};

export default mongoose.model("Shuttles", shuttleSchema);
