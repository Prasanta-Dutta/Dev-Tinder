const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim:true,
    },
    lastName: {
        type: String
    },
    age: {
        type: Number,
        validate(value){
            if(value < 5){
                throw new Error("Minimun age should be 5");
            }
        },
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
    },
    mobile: {
        type: Number,
    },
    institutions:{
        type: [String],
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    skills: {
        type: [String],
    },
    about: {
        type: String,
        default: "I am eagar about development",
    },
},
{
    timestamps: true,
});

const Users = mongoose.model("User", userSchema);
module.exports = {Users};