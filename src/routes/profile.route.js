const express = require("express");
const { userAuth, profileEditInputSanitize } = require("../middlewares");
const { Users } = require("../models");
const { changePasswordDataSanitize } = require("../middlewares/userInputSanitize");
const profileRouter = express.Router();

profileRouter.get("/api/V0/view", userAuth, async (req, res) => {
    try {
        return res.send(req.user);  //  Not check bcs if token not found then this middleware will never call
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

profileRouter.patch("/api/V0/edit", userAuth, profileEditInputSanitize, async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.user._id, req.updatedUser);
        // return res.send("User updated successfully");
        return res.send(req["updatedUser"]);
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

profileRouter.patch("/api/V0/change/password", userAuth, changePasswordDataSanitize, async (req, res) => {
    try {
        const { existingPassword, newPassword, confirmPassword } = req.body;
        const user = await Users.findById(req.user._id);

        if (! await user.comparePassword(existingPassword)) {
            return res.send("Wrong existing password");
        }

        const newHashPassword = await Users.generateHashPassword(newPassword);
        user.password = newHashPassword;
        await user.save();

        return res.send(user);
    }
    catch (err) {
        res.send("Error: " + err.message);
    }
});

module.exports = {
    profileRouter
};