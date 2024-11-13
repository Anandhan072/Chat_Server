/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const socketHandlers = require("./controller/socketHandlers"); // Import socket handlers

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("Error: unable to connect to DB", err));

app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
  },
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Initialize Socket.IO handlers
socketHandlers(io);

const port = process.env.PORT || 3003;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
