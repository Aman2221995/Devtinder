const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //reading the "from user id" from user object
      const fromUserId = req.user._id;
      //reading the "to user id" from url
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type " + status,
        });
      }

      //If there is an existing ConnectionRequest between toUser and fromUse
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName +
          " is " +
          " " +
          status +
          " in " +
          toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }

    //Sending a connection request
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      /**
       * Test Cases:
       * Cristiano => Henry
       * loggedInId = toUserId
       * status = interested
       * request Id should be valid
       */

      const loggedInuser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed !",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInuser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data,
      });
    } catch (error) {
      req.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = requestRouter;
