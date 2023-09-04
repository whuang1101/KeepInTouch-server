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
    try {
        const findOne = await User.findOne({ email: req.user.email });
        if (findOne) {
          // User found, return user data
          res.status(200).json({
            success: true,
            message: "successfully",
            user: findOne,
            cookies: req.cookies,
          });
        } else {
          // User not found
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error("User data retrieval error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
})

module.exports = router;