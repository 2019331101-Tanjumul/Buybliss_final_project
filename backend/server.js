import http from "http";
import express from 'express';
import cors from 'cors';
import { getHomeProducts, getSearchedProducts } from "./controllers/products.controller.js";

const app = express();

app.use(cors({ withCredentials: true }))
app.use(express.json())

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.get("/", async (req, res) => {
  await getHomeProducts(req, res);
})

app.get("/:searchKey", async (req, res) => {
  await getSearchedProducts(req, res);
})