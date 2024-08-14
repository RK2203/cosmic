import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import shuttle from "./Routes/Shuttles.js";
import mongoose from "mongoose";
import cors from "cors";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import usertypedef from "./Typedefs/usertypedef.js";
import userResolver from "./Resolvers/User_Resolver.js";
import driverType from "./Typedefs/drivertypedef.js";
import driverResolver from "./Resolvers/Driver_Resolver.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

dotenv.config();

// Hey I am new2

const app = express();
app.use(express.json());
const options = {
	origin: "http://localhost:3000",
	credentials: true,
};
app.use(cors(options));

const port = 8000;
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

await server.start();

app.use(
	"/graphql",
	expressMiddleware(server, {
		context: async ({ req, res }) => ({ req, res }),
	})
);

app.use("/Shuttles", shuttle);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
