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

module.exports = {
    signinInputSanitize
};