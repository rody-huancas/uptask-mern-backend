import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import projectRoutes from "./routes/projectRoutes";

import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";

// variables de entorno
dotenv.config();

// conexión a la bd
connectDB();

const app = express();

// cors
app.use(cors(corsConfig));

// logging
app.use(morgan('dev'))

// leer datos del formulario
app.use(express.json());

// rutas
app.use("/api/projects", projectRoutes);

export default app;
