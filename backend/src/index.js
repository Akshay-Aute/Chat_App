import express from "express";
import dotenv from "dotenv";

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json()); // to extract JSON data form body;
app.use("/api/auth", authRoutes); // http://localhost:3000/api/auth

app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
