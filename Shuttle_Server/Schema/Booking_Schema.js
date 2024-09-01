import mongoose from "mongoose";
const { Schema } = mongoose;

const shuttleBookingSchema = new Schema({
	Booking_id: String,
	Shuttle_id: String,
	User_id: String,
	Driver_id: String,
	Fare: Number,
	Day: String,
});
