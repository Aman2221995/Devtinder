// Handle Auth Middleware for all GET,POST...
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Read the token from the request cookies

  try {
    const { token } = req.cookies;

    if(!token){
      throw new Error("Token is not valid!");
    }

    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User Not Found");
    }

    //Attaching the user to the request object
    req.user = user;
    //Navigate to the next route handler
    next();
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }

  //Validate the token
  //Find the User
};

module.exports = { userAuth };
