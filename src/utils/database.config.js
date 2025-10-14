const mongoose = require("mongoose");
const { DATABASE_URI } = require("../constants");

const connectDB = async () => {
    await mongoose.connect(DATABASE_URI);
    console.log("Database connected successfully");
}

module.exports = {connectDB};