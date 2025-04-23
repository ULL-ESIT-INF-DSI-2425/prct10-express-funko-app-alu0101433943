import express from "express";
import funkosRouter from "../routes/funkos.js";

const app = express();

app.use(express.json());

app.use("/funkos", funkosRouter);

export default app;
