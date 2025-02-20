const express = require("express");
const port = 5000;
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./userRouter.js");
const url =
  "mongodb+srv://supravchand2:y1npKnn0P2hgntwv@cluster0.ci69x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const server = async () => {
  try {
    await mongoose.connect(url);
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
};
server();

app.use("/api/users", userRoutes);
app.listen(port, console.log(`http://localhost:${port}`));
