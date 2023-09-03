const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Friend = require("../models/friendRequest");

module.exports.getAllPotentialFriends = asyncHandler(async(req,res,next) => {
    const allUsers = await User.find().exec();
    const allFriendRequests = await Friend.find({
        $or: [{ sender: req.params.id }, { recipient: req.params.id }]
      }).exec();
      if(allFriendRequests.length !== 0){
    // if they have a friend request out already delete them from users
    const allPotentialId = allFriendRequests.reduce((userId, current) => {
        if(!userId.includes(current.sender)){
            userId.push(current.sender)
        }
        if(!userId.includes(current.recipient)){
            userId.push(current.recipient)
        }
        return userId;
    },[])
    const filteredUsers = [];
    for(let i =0; i< allUsers.length; i ++) {
        let a = 0
        for(let j = 0; j < allPotentialId.length; j ++){
            if(!allPotentialId[j].equals(allUsers[i]._id)){
                a += 1;
            }
        }
        if( a === allPotentialId.length){
            filteredUsers.push(allUsers[i]);
        }
    }
    res.status(200).json(filteredUsers)}
    else{
        res.status(200).json(allUsers)
    }
}   
)

module.exports.getAllFriends = asyncHandler(async(req,res,next) => {

    const allFriends = await User.findOne({_id:req.params.id}).populate("friend_list").exec();
    const friend_list = allFriends.friend_list;
    if(friend_list){
        res.status(200).json(friend_list);
    }
    else {
        res.send(404).json({message: "friend_list not found"})
    }
})
module.exports.getOne = asyncHandler(async(req,res, next) => {
    const id = req.params.id;
    const findUser = await User.findById(id);
    if(findUser){
        res.status(200).json(findUser);
    }
    else{
        res.statusMessage(404);
    }
})