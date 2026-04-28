const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/users");
const ticketRouter = require("./routes/tickets");
const adminRouter = require("./routes/admin");

const app = express();
const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/metro";

if (mongoose.connection.readyState === 0) {
  mongoose.connect(url);
  mongoose.connection.once("open", () => {
    console.log("MongoDB connected");
  });
}

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

["", "/api"].forEach((prefix) => {
  app.use(`${prefix}/auth`, userRouter);
  app.use(`${prefix}/tickets`, ticketRouter);
  app.use(`${prefix}/admin`, adminRouter);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;
