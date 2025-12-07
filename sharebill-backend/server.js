require("dotenv").config();


const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);  // <--- IMPORTANT

app.listen(5000, () => console.log("Server running on port 5000"));
