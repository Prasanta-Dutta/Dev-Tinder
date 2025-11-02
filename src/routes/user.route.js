const express = require("express");
const { userAuth } = require("../middlewares");
const { ConnectionRequests } = require("../models");
const userRouter = express.Router();

userRouter.get("/api/V0/requests/received", userAuth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const requests = await ConnectionRequests.find({
            toUserId: userId,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age"]);

        return res.send(requests);
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

userRouter.get("/api/V0/connections", userAuth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const connections = await ConnectionRequests.find({
            $or: [
                { toUserId: userId },
                { fromUserId: userId },
            ],
            status: "accepted"
        })
        .populate({
            path: 'fromUserId',
            match: { _id: { $ne: userId } },
            select: 'firstName lastName age'
        })
        .populate({
            path: 'toUserId',
            match: { _id: { $ne: userId } },
            select: 'firstName lastName age'
        });

        return res.send(connections);
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

module.exports = { userRouter };