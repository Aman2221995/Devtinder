const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    console.log(user);
    console.log(password);

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

      res.cookie("token", token, { expires: new Date(Date.now() + 2 * 36000) });

      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

app.post("/sendConnectioRequest", userAuth, async (req, res) => {
  const user = req.user;

  //Sending a connection request

  res.send(user.firstName + " sent the connection request");
});

connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
  });
