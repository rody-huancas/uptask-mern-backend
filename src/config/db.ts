import colors from "colors";
import mongoose from "mongoose";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.magenta(`MongoDB conectado en: ${url}`));
  } catch (error) {
    console.log(colors.red("[ERROR]: Al conectarse a MongoDB"));
    exit(1);
  }
};
