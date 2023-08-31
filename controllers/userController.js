const asyncHandler = require("express-async-handler");
const User = require("../models/user");
module.exports.getAll = asyncHandler(async(req,res,next) => {
    const allUsers = await User.find().exec();
    res.status(200).json(allUsers)
})