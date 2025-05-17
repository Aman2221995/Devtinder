const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Sachin",
    lastName: "Tendulkar",
    emailId: "sachin@tendulkar.com",
    password: "sachin@123",
  };

  try {
    const user = new User(userObj);

    await user.save();
    res.send("User Added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user" + err.message);
  }

  //Creating a new instance of the User nodel
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
