const validator = require("validator");

const signinInputSanitize = (req, res, next) => {
    try {
        for (const key in req.body) {
            if (typeof (req.body[key]) === "string") {
                req.body[key] = req.body[key].trim();
            }
        }

        const { email, password } = req.body;

        // Can convert to a middleware userInputSanitization - Wait for final touch
        if ([email, password].some((value) => {
            return value === undefined || value === "" || value === null;
        })) {
            return res.send("Email or password can not be empty");
        }

        if (!validator.isEmail(email)) {
            return res.send("Invalid email");
        }

        next();
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
};

const signupInputSanitize = (req, res, next) => {
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

        next();
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
};

module.exports = {
    signinInputSanitize,
    signupInputSanitize
};