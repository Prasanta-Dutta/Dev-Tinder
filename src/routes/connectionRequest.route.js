const express = require("express");
const { userAuth } = require("../middlewares");
const { Users, ConnectionRequests } = require("../models");
const { default: mongoose } = require("mongoose");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/api/V0/request/send/:requestType/:toUserId", userAuth, async (req, res) => {
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

connectionRequestRouter.post("/api/V0/request/review/:requestType/:requestId", userAuth, async (req, res) => {
    try{
        // loggedinId -> toUserId, to whome the request has send
        // requestId -> connectionRequest Id
        // status -> interested

        // Suppose Akshay send/interested on Elon
        // Akshay -> fromUserId
        // Elon -> toUserId -> loggedin Id

        const toUserId = req.user._id;
        const {requestType, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected", "blocked"];

        // console.log(requestType);
        // console.log(requestId);

        // return res.send("Accepting...");

        if(!allowedStatus.includes(requestType)){
            return res.send("Invalid request type");
        }

        const request = await ConnectionRequests.findOne({
            _id: requestId,
            toUserId,
            status: "interested",
        });

        if(!request){
            return res.send("Trying to accept invalid request");
        }

        request.status = requestType;
        await request.save();
        return res.send(request);
    }
    catch (err){
        return res.send("Error: " + err.message);
    }
})

module.exports = {
    connectionRequestRouter
};