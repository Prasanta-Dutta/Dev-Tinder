const express = require("express");
const { PORT } = require("./constants");
const { connectDB } = require("./utils");
const { Users } = require("./models");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { auth, signinInputSanitize, signupInputSanitize } = require("./middlewares");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/user/api/V0/signup", signupInputSanitize, async (req, res, next) => {
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

app.post("/user/api/V0/signin", signinInputSanitize, async (req, res) => {
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

app.patch("/user/api/V0/profile", auth, async (req, res) => {
    try {
        return res.send(req.user);  //  Not check bcs if token not found then this middleware will never call
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is listening at PORT: ", PORT);
    });
})
    .catch((err) => {
        console.log("Error");
    });

