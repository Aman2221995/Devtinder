const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "skills"];
//Get all the pending connection request for the loogedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    req.status(400).send("Error: " + error.message);
  }
});

/**
 * In this api we are checking that a user can send the request or it got
 * request from other user.So we are finding the number of request per user
 * Explanation->User can be fromUserId or toUserId
 */
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser)

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

    const data = connectionRequest.map((row=>{
      console.log(typeof(row.toUserId));
      if(row.toUserId._id === loggedInUser._id){
        return row.fromUserId
      }
      return row.toUserId;
    }))

    res.json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
