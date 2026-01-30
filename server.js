const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/gatepass", require("./routes/gatepassRoutes"));

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
