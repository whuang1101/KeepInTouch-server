const asyncHandler = require("express-async-handler");
const Message = require("../models/message")
module.exports.postPrivateMessage = asyncHandler(async(req,res, next) =>{
    const message = req.body;
    const newMessage = new Message(message);
    try
    {const savedMessage = await newMessage.save();
    if(savedMessage){
        res.status(201).json({message:"saved successfully"});
    }}
    catch (error) {
        console.error("Error saving message", error);
        res.status(500).json({error: "Internal error"})
    }
}) 
module.exports.getAllMessages = asyncHandler(async(req,res,next) => {
    const senderId = req.params.senderId;
    const recipientId = req.params.recipientId;
    const findMessages = await Message.find({$or: [{sender: senderId, recipient: recipientId}, {sender: recipientId, recipient: senderId}]})
    if(findMessages){
        res.status(200).json(findMessages)
    }
    else {
        res.status(404).json({message: "messages not found"})
    }
})