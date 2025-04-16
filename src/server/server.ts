// src/server/server.ts
import express from "express";
import funkosRouter from "../routes/funkos.js";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Todas las peticiones HTTP se realizan a partir de la ruta /funkos
app.use("/funkos", funkosRouter);

export default app;
