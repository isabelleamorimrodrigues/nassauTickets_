const express = require("express");
const cors = require("cors");
const filaRoutes = require("./routes/filaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", sistema: "nassauTickets" });
});

app.use("/api", filaRoutes);

module.exports = app;