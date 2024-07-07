import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";

// variables de entorno
dotenv.config();

// conexión a la bd
connectDB();

const app = express();

// Parsear las solicitudes JSON
app.use(express.json());

// rutas
app.use("/api/projects", projectRoutes);

export default app;
