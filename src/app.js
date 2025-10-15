const express = require("express");
const { PORT } = require("./constants");
const { connectDB } = require("./utils");
const { Users } = require("./models");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { auth, signinInputSanitize } = require("./middlewares");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/user/api/V0/signup", async (req, res, next) => {
    try {
        for (const key in req.body) {
            if (typeof (req.body[key]) === "string") {
                req.body[key] = req.body[key].trim();
            }
        }

        const { firstName, lastName, email, mobile, gender, age, password } = req.body;

        if ([firstName, lastName, email, mobile, age, password].some((value) => {
            return value === undefined || value === ""
        })) {
            return res.send("All filds are required");
        }

        if (!validator.isEmail(email)) {
            return res.send("Email is not valid");
        }

        if (!validator.isMobilePhone(mobile + "")) {
            return res.send("Mobile is not valid");
        }

        const isUserExist = await Users.findOne({ email });

        if (isUserExist) {
            return res.send("User already exist"); // Invalid cradentials
        }

        const hashedPassword = await bcrypt.hash(password, 9);

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

