const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema =  new Schema({
    username:{type: String},
    password: {type:String},
    name: {type:String,required: true},
    friend_list: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users"}],
    email: {type:String, required: true},
    image_url: {type:String},
})

module.exports = mongoose.model("Users", userSchema)