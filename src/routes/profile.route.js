const express = require("express");
const { auth } = require("../middlewares");
const profileRouter = express.Router();

profileRouter.get("/api/V0/view", auth, async (req, res) => {
    try {
        return res.send(req.user);  //  Not check bcs if token not found then this middleware will never call
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

module.exports = {
    profileRouter
};