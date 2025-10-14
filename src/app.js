const express = require("express");
const { PORT } = require("./constants");
const { connectDB } = require("./utils");
const { Users } = require("./models");
const validator = require("validator");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/user/api/V0/signupdummy", async (req, res, next) => {
    console.log("API hited");
    const dummyData = {
        firstName: "Dummy",
        lastName: "Data",
        email: "dummy5@data.com",
        password: "dummy@321"
    };

    const user = new Users(dummyData);
    const result = await user.save();
    console.log(result);

    res.send("User created successfully");
});

app.post("/user/api/V0/signup", async (req, res, next) => {
    try{
        for(const key in req.body){
            if(typeof(req.body[key]) === "string"){
                req.body[key] = req.body[key].trim();
            }
        }

        const {firstName, lastName, email, mobile, gender, age, password} = req.body;

        if([firstName, lastName, email, mobile, age, password].some((value) => {
            return value === undefined || value === ""
        })){
            return res.send("All filds are required");
        }
        
        if(!validator.isEmail(email)){
            return res.send("Email is not valid");
        }

        if(!validator.isMobilePhone(mobile + "")){
            return res.send("Mobile is not valid");
        }

        const isUserExist = await Users.findOne({email});
        
        if(isUserExist){
            return res.send("User already exist"); // Invalid cradentials
        }

        const hashedPassword = await bcrypt.hash(password, 9);

        const user = new Users({firstName, lastName, email, mobile, gender, age, password: hashedPassword});
        const result = await user.save();
        console.log(result);
        if(result){
            return res.send("User successfully registered");
        }
        return res.send("Failed to register user");
    }
    catch(err){
        return res.send("Error: " + err.message);
    }
});

app.post("/user/api/V0/signin", async (req, res) => {
    for(const key in req.body){
        if(typeof(req.body[key]) === "string"){
            req.body[key] = req.body[key].trim();
        }
    }

    const {email, password} = req.body;

    if([email, password].some((value) => {
        return value === undefined || value === "" || value === null;
    })){
        return res.send("Email or password can not be empty");
    }

    if(!validator.isEmail(email)){
        return res.send("Invalid email");
    }

    const isUserExisted = await Users.findOne({email});
    if(!isUserExisted){
        return res.send("Invalid credential");
    }

    if(await bcrypt.compare(password, isUserExisted.password)){
        return res.send("Login successful");
    }
    else{
        return res.send("Invalid credential");
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

