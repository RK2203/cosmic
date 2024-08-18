import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());



const port = 7000;

console.log(process.env.DATABASE_URL)

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log(`SEREVER RUNNING ON PORT ${port}`);
});
