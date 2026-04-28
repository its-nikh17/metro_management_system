const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const app = express();
const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metro';

mongoose.connect(url);
mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
});

//middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

const userRouter = require('./routes/users');
const ticketRouter = require("./routes/tickets");
const adminRouter = require("./routes/admin");
app.use('/auth', userRouter);
app.use('/tickets', ticketRouter);
app.use("/admin", adminRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
