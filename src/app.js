const express = require("express");
const { PORT } = require("./constants");
const { connectDB } = require("./utils");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth.route");
const { profileRouter } = require("./routes/profile.route");
const { connectionRequestRouter } = require("./routes/connectionRequest.route");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/connectionRequest", connectionRequestRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is listening at PORT: ", PORT);
    });
})
    .catch((err) => {
        console.log("Error");
    });

