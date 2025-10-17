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

const profileEditInputSanitize = (req, res, next) => {
    try {
        for (const key in req.body) {
            if (typeof (req.body[key]) === "string") {
                req.body[key] = req.body[key].trim();
            }
        }

        const allowedFields = ["firstName", "lastName", "age", "gender", "mobile", "institutions", "skills", "about"];
        const updatedFields = Object.keys(req.body).filter((field) => {
            return allowedFields.includes(field);
        });

        if (updatedFields.includes("mobile") && !validator.isMobilePhone(req.body.mobile + "")) {
            return res.send("Mobile is not valid");
        }

        req["updatedUser"] = {};

        updatedFields.forEach((field) => {
            req["updatedUser"][`${field}`] = req.body[`${field}`];
        });

        next();
    }
    catch (err) {
        return res.send("Error: " + err.message);
    }
}

const changePasswordDataSanitize = (req, res, next) => {
    try {
        const allowedFields = ["existingPassword", "newPassword", "confirmPassword"];

        for (const key in req.body) {
            if (allowedFields.includes(key) && typeof (req.body[key]) !== "string") {
                return res.send("All field should be string only");
            }
            else{
                req.body[key] = req.body[key].trim();
            }
        }

        const { existingPassword, newPassword, confirmPassword } = req.body;

        if ([existingPassword, newPassword, confirmPassword].some((field) => {
            return field === undefined || field === "" || field === null;
        })) {
            return res.send("All field are required");
        }

        if(newPassword !== confirmPassword){
            return res.send("New & confirm password should be same");
        }

        next();
    }
    catch (err) {
        res.send("Error: " + err.message);
    }
};

module.exports = {
    signinInputSanitize,
    signupInputSanitize,
    profileEditInputSanitize,
    changePasswordDataSanitize
};