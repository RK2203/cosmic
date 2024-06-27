import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import shuttle from "./Routes/Shuttles.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.us;
const port = 8000;
dotenv.config();

const url = process.env.URL;

async function connectDB() {
	const client = new MongoClient(url);
	await client.connect();
	await mongoose.connect(url);
}

connectDB()
	.then(() => {
		console.log("Database connected");
	})
	.catch(() => {
		console.log("Database connection failed");
	});

app.use("/Shuttles", shuttle);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
