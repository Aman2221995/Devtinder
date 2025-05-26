const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

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
 * In this api(/user/connection) we are checking that a user can send the request or it got
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
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      console.log(typeof row.toUserId);
      if (row.toUserId._id === loggedInUser._id) {
        return row.fromUserId;
      }
      return row.toUserId;
    });

    res.json({
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    /**
     * User should see all the user cards except:
     * 1.his own card
     * 2.his connection
     * 3.ignored people
     * 4.already sent the connection request
     *
     * Example:Rahul=>[Akshay,Elon,Mark,Donald,Virat,Dhoni]
     * Rahul-->Akshay:rejected, Rahul -->Elon:accepted,Now Rahul will see [Mark,Donald,Virat,Dhoni]
     * Akshay will see:[Elon,Mark,donald,Virat,Dhoni]
     * Rahul will see:[Mark,Donald,Virat,Dhoni]
     */

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    //Find all the connection request [sent+received]
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.toUserId.toString());
      hideUsersFromFeed.add(req.fromUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status.json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
