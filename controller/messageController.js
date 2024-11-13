/* eslint-disable no-empty */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Conversation = require("../modules/messageModules");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { participants, messages } = req.body;

  if (!participants || participants.length < 2) {
    return next(new AppError("must be include id from user", 400));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: participants }, // Ensure all participants are in the array
  });

  if (conversation) {
    conversation.messages.push(messages);
    conversation.lastMessageAt = Date.now(); // Update last message time
    await conversation.save();

    conversation.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const lastMessage = conversation.messages[0];

    return res.status(200).json({
      status: "success",
      data: {
        lastMessage,
      },
    });
  } else {
    conversation = await Conversation.create({
      participants,
      messages,
    });

    return res.status(201).json({
      status: "success",
      data: {
        conversation,
      },
    });
  }
});

exports.getAllMessage = catchAsync(async (req, res, next) => {
  let participants = req.params.id;
  participants = participants.split(",");

  console.log(participants);

  if (!participants || participants.length < 2) {
    return next(new AppError("must be include id from user", 400));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: participants }, // Ensure all participants are in the array
  });

  if (conversation) {
    res.status(200).json({
      status: "Get All Tours",
      data: { conversation },
    });
  } else {
    conversation = await Conversation.create({
      participants,
      message: [],
    });
    res.status(200).json({
      status: "Get All Tours",
      data: { conversation },
    });
  }
  conversation.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

exports.patchMessage = catchAsync(async (req, res, next) => {
  let { participants, messageID } = req.query;

  // Ensure participants is an array of strings
  participants = participants.split(",");
  console.log("Participants:", participants);

  if (!participants || participants.length < 2) {
    return next(new AppError("Must include IDs of at least two participants", 400)); // Changed to 400 (Bad Request)
  }

  // Find conversation by participant IDs
  const conversation = await Conversation.findOne({
    participants: { $all: participants },
  });

  if (!conversation) {
    return next(new AppError("Conversation not found", 404));
  }

  // Find the message to patch by messageID
  const messageIndex = conversation.messages.findIndex((msg) => msg._id.toString() === messageID);

  if (messageIndex === -1) {
    return next(new AppError("Message not found", 404));
  }

  // Soft delete: Update the message content and status
  conversation.messages[messageIndex].content = "This message has been deleted";
  conversation.messages[messageIndex].messagesStatus = true; // Assuming you have this field in your schema

  // Save the updated conversation
  await conversation.save();

  return res.status(200).json({
    status: "success",
    message: "Message updated successfully",
    data: {
      message: conversation.messages[messageIndex], // Return the updated message
    },
  });
});
