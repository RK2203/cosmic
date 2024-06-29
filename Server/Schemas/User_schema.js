import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
	Name: String,
	Email: String,

	Phone: Number,

	UID: String,

	Shuttles: Array,
});

mongoose.models = {};

export default mongoose.model("Users", userSchema);
