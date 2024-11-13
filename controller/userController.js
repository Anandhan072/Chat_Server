/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
const UserAccount = require("../modules/userModules");

// eslint-disable-next-line node/no-unsupported-features/es-syntax

exports.getAll = async (req, res) => {
  try {
    console.log(req.body);
    // Attempt to create a new user
    const newUser = await UserAccount.find().sort("-createdDate");

    // Send success response if user is created successfully
    res.status(201).json({
      status: "success",
      message: "Successfully created account",
      data: {
        user: newUser, // Omit sensitive fields like password if needed
      },
    });
  } catch (err) {
    // Handle different error types (e.g., validation, unique constraint, etc.)
    res.status(400).json({
      status: "fail",
      message: "User creation failed",
      error: err.message, // Provide specific error details
    });
  }
};
