const express = require("express");
const { userAuth } = require("../middlewares");
const { Users, ConnectionRequests } = require("../models");
const { default: mongoose } = require("mongoose");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/api/V0/request/:requestType/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const requestType = req.params.requestType;
        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(requestType)){
            return res.send("Invalid request type");
        }

        if(!mongoose.Types.ObjectId.isValid(toUserId)){
            return res.send("Invalid toUserId");
        }

        if(fromUserId.equals(toUserId)){
            return res.send("Can not send request to yourself");
        }

        const user = await Users.findById(toUserId);
        if(!user){
            return res.send("Trying to send request to an invalid user");
        }

        const request = await ConnectionRequests.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(request){
            return res.send("Request has sent already");
        }

        const connectionRequest = new ConnectionRequests({fromUserId, toUserId, status: requestType});
        await connectionRequest.save();

        return res.send(connectionRequest);
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

module.exports = {
    connectionRequestRouter
};