/* eslint-disable prettier/prettier */
const express = require("express");

const { sendMessage, getAllMessage, patchMessage } = require("../controller/messageController");
const { protect } = require("../controller/authController");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:id").get(protect, getAllMessage);

router.route("/patch").patch(protect, patchMessage);

module.exports = router;
