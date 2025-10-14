const express = require("express");
const { PORT } = require("./constants");
const { connectDB } = require("./utils");
const { Users } = require("./models");
const validator = require("validator");

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

        const user = new Users({firstName, lastName, email, mobile, gender, age, password});
        const result = await user.save();
        console.log(result);
        return res.send("API call successfull");
    }
    catch(err){
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

