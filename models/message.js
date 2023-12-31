const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema =  new Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"},
    recipient: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"},
    content: {type: String, required: true},
    date: {type: Date, required: true, },
    read: {type: Boolean}
})

module.exports = mongoose.model("Messages", messageSchema)