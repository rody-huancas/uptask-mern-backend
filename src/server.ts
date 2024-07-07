import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// variables de entorno
dotenv.config();

// conexión a la bd
connectDB();

const app = express();

export default app;
