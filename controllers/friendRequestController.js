const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Friend = require("../models/friendRequest")

module.exports.post = asyncHandler(async(req,res,next) => {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const findSender = await User.findOne({email:sender}).exec();
    const findRecipient = await User.findOne({email:recipient}).exec();
    if(findSender && findRecipient){
        const newFriendRequest = new Friend({
            sender: findSender._id,
            recipient: findRecipient._id,
            status: 2
        })
        const alreadyExists = await Friend.findOne({sender: newFriendRequest.sender, recipient:newFriendRequest.recipient})
        if(alreadyExists){
            res.status(409)
        }
        else{
            await newFriendRequest.save();
            res.status(200).json({message: "success"})
        }
    }
    else {
        res.status(404)
    }

})