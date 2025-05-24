const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //Validation of data
    validateSignUpData(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }

  //Creating a new instance of the User nodel
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    // console.log(user);
    // console.log(password);

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      /*
      1.Create a JWT Token
      2.Add the token to cookie and send the response back to the user.
      */

      const token = await user.getJWT();
      console.log(token);

      res.cookie("token", token, { expires: new Date(Date.now() + 2 * 360000) });

      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successfull !");
});

module.exports = authRouter;
