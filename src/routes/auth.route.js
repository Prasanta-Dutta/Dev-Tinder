const express = require("express");
const { signupInputSanitize, signinInputSanitize } = require("../middlewares");
const { Users } = require("../models");
const authRouter = express.Router();

authRouter.post("/api/V0/signup", signupInputSanitize, async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, gender, age, password } = req.body;
        const isUserExist = await Users.findOne({ email });

        if (isUserExist) {
            return res.send("User already exist"); // Invalid cradentials
        }

        const hashedPassword = await Users.generateHashPassword(password);
        const user = new Users({ firstName, lastName, email, mobile, gender, age, password: hashedPassword });
        const result = await user.save();
        console.log(result);
        if (result) {
            return res.send("User successfully registered");
        }
        return res.send("Failed to register user");
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

authRouter.post("/api/V0/signin", signinInputSanitize, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });

        if (!user) {
            return res.send("Invalid credential");
        }

        if (await user.comparePassword(password)) {
            const token = await user.generateJWT();
            res.cookie("userAuthenticationToken", token);
            return res.send("Login successful");
        }
        else {
            return res.send("Invalid credential");
        }
    }
    catch (err) {
        res.send("Error: " + err.message);
    }
});

authRouter.post("/api/V0/logout", async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie.userAuthenticationToken) {
            return res.send("User already logged out");
        }
        else{
            return res
            .clearCookie("userAuthenticationToken")
            .send("User logged out successfully");
        }
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
})

module.exports = {
    authRouter
};