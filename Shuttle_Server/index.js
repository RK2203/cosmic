import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import shuttle_type from "./Typedefs/Routes.typedef.js";
import Shuttle_resolver from "./Resolvers/Routes.resolver.js";
import shuttleData_type from "./Typedefs/Shuttle.typedef.js";
import shuttle_Data_Resolver from "./Resolvers/Shuttles.resolver.js";

import verifyToken from "./Middlewares/Verify.js";

const app = express();
app.use(express.json());
const options = {
	origin: "http://localhost:3000",
	credentials: true,
};
app.use(cors(options));

app.use(verifyToken);

const url = process.env.MONGO_URL;


async function connectDB() {
	const client = new MongoClient(url);
	await client.connect();
	await mongoose.connect(url);
}

connectDB()
	.then(() => {
		console.log("DATABASE CONNECTED");
	})
	.catch(() => {
		console.log("Database connection failed");
	});

const typeDefs = mergeTypeDefs([shuttle_type, shuttleData_type]);
const resolvers = mergeResolvers([Shuttle_resolver, shuttle_Data_Resolver]);

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const port = 7000;
await server.start();
app.use(
	"/Shuttle_endpoint",
	expressMiddleware(server, {
		context: async ({ req, res }) => ({ req, res }),
	})
);

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log(`SEREVER RUNNING ON PORT ${port}`);
});
