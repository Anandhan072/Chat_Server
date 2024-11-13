/* eslint-disable prettier/prettier */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies

const userRouter = require("./routers/userRouters");
const messageRoute = require("./routers/messageRoute");

const AppError = require("./utils/appError");
const globalError = require("./controller/errorController");

const app = express(); // creating the express app

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // console request type of request received
}

app.use(express.json()); // will parse the body and make the data available on req.body in the route handlers.

app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

app.use(express.static(`${__dirname}/public`)); //

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRoute);

app.use("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Cant fin ${req.originalUrl} on this server!`,
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;

/// socket.io is backend

// socket.io.client for frontend
