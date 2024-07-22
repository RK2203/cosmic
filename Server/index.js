import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import shuttle from "./Routes/Shuttles.js";
import users from "./Routes/User.js";
import driver from "./Routes/Driver.js";
import mongoose from "mongoose";
import cors from "cors";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import usertypedef from "./Typedefs/usertypedef.js";
import userResolver from "./Resolvers/User_Resolver.js";
import driverType from "./Typedefs/drivertypedef.js";
import driverResolver from "./Resolvers/Driver_Resolver.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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

const typeDefs = mergeTypeDefs([usertypedef, driverType]);
const resolvers = mergeResolvers([userResolver, driverResolver]);

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

app.use("/Shuttles", shuttle);
app.use("/Users", users);
app.use("/Drivers", driver);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

async function run() {
	await startStandaloneServer(server);
	app.listen(port, () => {
		console.log(`App listening on port ${port}`);
	});
}

run();
