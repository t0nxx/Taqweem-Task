const { Users, validateUser, validateUpdateUser } = require("../models/users");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Auth = require("../middlewares/auth");
const multer = require("multer");
const { upload } = require("../middlewares/uploader");

/* get all users " i won't set authentication here so that
 u could display all users without login " */

router.get("/", async (req, res) => {
  const users = await Users.find();
  try {
    res.json(users).status(200);
  } catch (error) {
    res.json(error.message).status(400);
  }
});

/* add new user , after u see the 'ok ${ur username } add ' u will be able to
 edit / delete ur data be going to /login and get ur jwt token */

router.post("/", async (req, res) => {
  const validateInputs = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar
  };
  // validate user inputs
  const { error } = validateUser(validateInputs);
  if (error) return res.status(400).json(error.details[0].message);

  const user = new Users(validateInputs);

  // check existing of username/email
  const checkUsername = await Users.findOne({ username: user.username });
  const checkEmail = await Users.findOne({ email: user.email });

  try {
    upload(req, res, async err => {
      /* start avatar upload check */
      if (err) return res.json(err);
      else if (!req.file)
        return res.status(400).json("Error : no file selected");
      else if (req.file.size > 300000)
        return res.status(400).json("Error : file shouldn't exceed 300KB");
      const avatarPath = req.file.path.replace(/\\/g, "/");
      /*end avatar uploadt check */
      ///////////////////////////////////////////////////
      /*start existing check */
      if (checkUsername) return res.status(400).send("user name already reg");
      if (checkEmail) return res.status(400).send("email already reg");
      user.password = await bcrypt.hash(user.password, 10);
      user.avatar = avatarPath;

      /*end sxisting check */
      await user.save();
      res.json(` ok ${user.username} added`).status(200);
    });
  } catch (error) {
    res.json(error.message);
  }
});

/* here u can update ur personal data by providing the token with
"Authorization" header the token will expiresIn 2 minutes*/
router.put("/update/me", Auth, async (req, res) => {
  const updatedData = req.body;
  // if (Object.keys(updatedData).length == 0)
  //   return res.status(400).json("no entred data to update");
  const { error } = validateUpdateUser(updatedData);
  if (error) return res.json(error.details[0].message);
  try {
    upload(req, res, err => {
      /* start avatar upload check */
      if (err) return res.json(err);
      else if (!req.file) return res.json("Error : no file selected");
      if (req.file.size > 300000)
        return res.json("Error : file shouldn't exceed 300KB");

      const avatarPath = req.file.path.replace(/\\/g, "/");
      updatedData.avatar = avatarPath;

      /*end avatar upload check */
    });

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    await Users.findOneAndUpdate({ _id: req.user._id }, updatedData);
    res.json("Data update successfully");
  } catch (error) {
    res.json(error.message);
  }
});

/* here u can delete ur profile by providing the token with
"Authorization" header  the token will expiresIn 2 minutes */

router.delete("/delete/me", Auth, async (req, res) => {
  try {
    const user = await Users.findOneAndRemove({ _id: req.user._id });
    res.json(`ok user ${user.username} deleted`);
  } catch (error) {
    res.json(error.message);
  }
});
/* for testing */
router.post("/upload", async (req, res) => {
  try {
    upload(req, res, err => {
      if (err) return res.status(400).json(err);
      else if (!req.file) return res.json("Error : no file selected");
      if (req.file.size > 300000)
        return res.json("Error : file shouldn't exceed 300KB");
      const avatarPath = req.file.path.replace(/\\/g, "/");
      res.json(avatarPath);
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
