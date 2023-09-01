const mongoose = require("mongoose");
const {Schema} = mongoose;

const friendRequestSchema =  new Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"},
    recipient: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"},
    status: {type: Number, required: true}
})

module.exports = mongoose.model("FriendRequest", friendRequestSchema)