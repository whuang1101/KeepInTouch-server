const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema =  new Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"},
    recipient: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"},
    content: {type: text, required: true},
    date: {type: Date, required: true, }
})

modules.export = mongoose.model("Messages", messageSchema)