/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
    maxlength: [25, "A name must have less or equal to 40 characters"],
    minlength: [3, "A name must have more or equal to 3 characters"],
  },

  lastName: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
    maxlength: [25, "A name must have less or equal to 40 characters"],
    minlength: [3, "A name must have more or equal to 3 characters"],
  },

  name: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: [true, "Email already exists!"], // Enforces uniqueness for the 'email' field
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },

  photo: {
    type: String,
  },

  DOB: {
    type: Object,
  },

  gender: {
    type: String,
    default: "male",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  confirmpassword: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      validator: function(val) {
        return this.password === val;
      },
    },
  },
  passwordChangedAt: Date,

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function(next) {
  this.name = `${this.firstName} ${this.lastName}`;
  // Only run this function if the password was modified (or is new)
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete `confirmpassword` field since we don't need to store it
  this.confirmpassword = undefined;
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userEnterPassword) {
  return await bcrypt.compare(candidatePassword, userEnterPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt.getTime() / 1000, JWTTimeStamp);
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    // If the password was changed after the token was issued, return true
    return JWTTimeStamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const UserAccount = mongoose.model("UserAccount", userSchema);

module.exports = UserAccount;
