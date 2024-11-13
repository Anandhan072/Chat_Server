/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");

// Define the message schema
const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
    ref: "UserAccount", // Reference the 'UserAccount' model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messagesStatus: {
    type: Boolean,
    default: true,
  },
});

// Define the conversation schema
const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
      ref: "UserAccount", // Reference the 'UserAccount' model
      required: true,
    },
  ],
  messages: [messageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update 'lastMessageAt' field before saving the conversation
conversationSchema.pre("save", function(next) {
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].createdAt;
  }
  next();
});

// Check if the model is already defined
const Conversation =
  mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
