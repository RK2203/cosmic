import mongoose from "mongoose";
const { Schema } = mongoose;

const stopageSchema = new Schema({
	Name: String,

	location: Object,

	Shuttles: Array,
});

mongoose.models = {};

export default mongoose.model("Stopages", stopageSchema);
