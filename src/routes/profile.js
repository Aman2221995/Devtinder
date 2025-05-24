const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateSignUpData,
} = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully !`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.password;

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    if (!validator.isStrongPassword(req.body.password)) {
      throw new Error("Password is not strong");
    }

    req.user["password"] = newPasswordHash;

    await req.user.save();

    res.send("Password Updated Succesfully");
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

module.exports = profileRouter;
