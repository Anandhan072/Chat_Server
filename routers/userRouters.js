const express = require("express");

const { getAll } = require("../controller/userController");
const { createUser, logIn, protect } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(protect, getAll);

router.route("/chat").post(logIn);

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjVhNmRmZmQ1OWZmMDQxYzQ4OWQyMiIsImlhdCI6MTczMDUyNTQyNiwiZXhwIjoxNzMwNjExODI2fQ.YfNho-_-TVHrdUKXHP-wEXkg_0tur_bbK7AKG9QduTE
