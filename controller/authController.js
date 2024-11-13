/* eslint-disable import/order */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const UserAccount = require("../modules/userModules");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRES_IN}` });
};

exports.createUser = catchAsync(async (req, res, next) => {
  // Attempt to create a new user
  const newUser = await UserAccount.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Successfully created account",
    data: {
      user: newUser, // Omit sensitive fields like password if needed
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const CorrectUser = await UserAccount.findOne({ email: email });
  const user = await UserAccount.findOne({ email: email }).select("+password");

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("invalid email id or password", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    user: CorrectUser,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("your not logged in!", 401));
  }
  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if user still exists
  const freshUser = await UserAccount.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("The user belonging to this tokens does no longer exist", 401));
  }

  // 4) check if user changed  password after the token was issued

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("user recently change the password please login again", 401));
  }
  next();
});
