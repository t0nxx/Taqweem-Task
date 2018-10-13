const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("username and password are required");
    }
    const user = await Users.findOne({
      username: req.body.username
    });
    if (!user) return res.status(400).send("wrong username or password");
    checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) return res.status(400).send("wrong username or password");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: 60 * 15
    });
    res.send(token);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
