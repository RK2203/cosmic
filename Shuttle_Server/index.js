import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = 7000;

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log(`SEREVER RUNNING ON PORT ${port}`);
});
