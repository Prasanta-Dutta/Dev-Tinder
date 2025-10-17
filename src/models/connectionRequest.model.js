const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected", "blocked"],
            message: `{VALUE} is not supported`,
        },
    }
},
{
    timestamp: true
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

const ConnectionRequests = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = { ConnectionRequests };