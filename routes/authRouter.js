const passport = require("passport")
const User = require("../models/user")
const router = require("express").Router()
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect("http://localhost:5173/login");
})
router.get("/google", passport.authenticate("google", {scope: ["profile","email"]}))

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "./login/failed"
}))
router.get("/login/failed", (req,res) => {
    res.status(401).json({
        success:false,
        message:"failure"
    })
})
router.get("/login/success", async(req,res) => {
    if (req.user) {
        const findOne = await User.findOne({email: req.user.email});
        res.status(200).json(
            {success:true,
            message:"successfully",
            user:findOne,
            cookies: req.cookies
        }
        )
    }
    else{
        res.status(404).json({message:"failed to get"});
    }
})

module.exports = router;