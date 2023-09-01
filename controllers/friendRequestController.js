const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Friend = require("../models/friendRequest")

// Sends friend request if one is not already there
module.exports.post = asyncHandler(async(req,res,next) => {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const [findSender,findRecipient] = await Promise.all(
        [User.findOne({email:sender}).exec(),
        User.findOne({email:recipient}).exec()]);
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
// Gets sender of friend request
module.exports.get = asyncHandler(async(req,res,next)=> {
    const findRequests = await Friend.find({recipient: req.params.id, status: 2}).populate("sender").exec();
    res.status(200).json(findRequests);
})

//Handle getting pending Requests
module.exports.getPendingRequests = asyncHandler(async(req,res,next) => {
    const findRequests = await Friend.find({sender: req.params.id}).populate("recipient");
    res.status(200).json(findRequests)
})

// Handle Accept Friend Request
module.exports.acceptPost = asyncHandler(async(req,res,next) => {
    const sender = req.body.sender
    const recipient = req.body.recipient
    const findRequest = await Friend.findOneAndUpdate(
        {sender: sender._id, recipient: recipient._id},{status:1})

    if(findRequest){
        const [updateSender, updateRecipient] = await Promise.all([
            User.findByIdAndUpdate(sender._id, {$push: {friend_list:recipient._id}}),
            User.findByIdAndUpdate(recipient._id, {$push: {friend_list:sender._id}})
        ])
        res.status(200).json({message:"ok"})
    }
    else {
        res.status(404).json({message:"not found"});
    }
    res.status(200).json();
})
module.exports.declinePost = asyncHandler(async(req,res,next) => {
    const sender = req.body.sender
    const recipient = req.body.recipient
    const findRequest = await Friend.deleteOne(
        {sender: sender._id, recipient: recipient._id},{status:1})
    if(findRequest){
        res.status(200).json();
    }

})