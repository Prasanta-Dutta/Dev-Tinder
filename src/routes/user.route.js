const express = require("express");
const { userAuth } = require("../middlewares");
const { ConnectionRequests, Users } = require("../models");
const { set } = require("mongoose");
const userRouter = express.Router();

userRouter.get("/api/V0/requests/received", userAuth, async (req, res) => {
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

userRouter.get("/api/V0/connections", userAuth, async (req, res) => {
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

userRouter.get("/api/V0/feed", userAuth, async (req, res) => {
    // Building feed page for Elon, ignored
    // 1. Elon does not send request already
    // 2. Anybody send request to Elon -> these are shown in /review
    // 3. Elon is already connected/accepted
    // 4. Elon is ignored by someone
    // 5. Elon is rejected
    // 6. Elon can not send request to itself
    // So basically any entry created in connectionRequest Schema are not coming to Elon

    const loggedinUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const allRequest = await ConnectionRequests.find({
        $or: [
            {fromUserId: loggedinUserId},
            {toUserId: loggedinUserId}
        ]
    }).select("fromUserId toUserId");

    let filteredUser = new Set();
    allRequest.forEach((req) => {
        filteredUser.add(req.fromUserId.toString());
        filteredUser.add(req.toUserId.toString());
    });
    filteredUser = Array.from(filteredUser);

    const allowedUser = await Users.find({
        $and: [
            {_id: {$nin: filteredUser}},
            {_id: {$ne: loggedinUserId}}
        ]
    })
    .select("firstName lastName")
    .skip((page-1)*limit)
    .limit(limit);

    return res.send(allowedUser);

});

module.exports = { userRouter };