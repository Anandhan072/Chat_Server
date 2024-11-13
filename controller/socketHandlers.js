/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */
// socket/socketHandlers.js
// const Conversation = require("../modules/messageModules"); // Assuming this is the path to your conversation model

module.exports = function(io) {
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Listen for a chat message
    socket.on("chat message", (message) => {
      console.log("Received message:", message);

      // Broadcast the message to all connected clients (or you can specify specific users)
      io.emit("chat message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
