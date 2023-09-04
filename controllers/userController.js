const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Friend = require("../models/friendRequest");
const bcrypt = require("bcryptjs")
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
module.exports.createUser = asyncHandler(async(req,res,next) => {
    const user = req.body;

    bcrypt.hash(user.password, 10, async(err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return;
        }
        const newUser = new User({
            name: user.name,
            username: user.username,
            password: hashedPassword,
            email: user.email,
            image_url: user.image_url.length !== 0 ? user.image_url : "https://images.vexels.com/media/users/3/294731/isolated/preview/67317bd09b94882cdeda7ea95e2b9d09-self-esteem-cherry-cute-icon.png",
            friend_list: [],
            last_online: new Date(),
            online: false,
        })
        const emailExists = await User.findOne({email: user.email});
        const usernameExists =await User.findOne({username: user.username});
        if(emailExists || usernameExists){
            res.status(500).json({message: "Either email or username exists"})
        }
        else{
            await newUser.save();
        }

      });
}) 

module.exports.verifyEmail = asyncHandler(async(req,res,next) => {
    const email = await User.findOne({email:req.params.email});
    if (email) {
        res.status(200).json({ message: false});
      } else {
        res.status(200).json({ message: true });
      }
})
module.exports.verifyUsername = asyncHandler(async(req,res,next) => {
    const username = await User.findOne({username:req.params.username});
    if (username) {
        res.status(200).json({ message: false});
      } else {
        res.status(200).json({ message: true });
      }
})