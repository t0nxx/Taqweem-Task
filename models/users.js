const mongoose = require("mongoose");
const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const users_schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
});

const Users = mongoose.model("Users", users_schema);

const validateUser = user => {
  const Schema = {
    _id: joi.string(),
    username: joi
      .string()
      .alphanum()
      .min(3)
      .required(),
    email: joi
      .string()
      .email()
      .required(),
    password: joi
      .string()
      .min(6)
      .lowercase()
      .required(),
    firstName: joi
      .string()
      .min(3)
      .required(),
    lastName: joi
      .string()
      .min(3)
      .required(),
    avatar: joi.string()
  };
  return joi.validate(user, Schema);
};

const validateUpdateUser = user => {
  const Schema = {
    username: joi
      .string()
      .alphanum()
      .min(3),
    email: joi
      .string()
      .email()
      .lowercase(),
    password: joi.string().min(6),
    firstName: joi.string().min(3),
    lastName: joi.string().min(3),
    avatar: joi.string()
  };
  return joi.validate(user, Schema);
};

exports.Users = Users;
exports.validateUser = validateUser;
exports.validateUpdateUser = validateUpdateUser;
