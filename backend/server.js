import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import app from "./app.js";

dotenv.config({ path: "./config/.env" });


const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.log("Unable to run server due to db connection error:", error)
    })
  })
  .catch((error) => {
    console.log("MongoDB connection failed!!!", error);
  });