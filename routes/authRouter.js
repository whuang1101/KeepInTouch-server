const passport = require("passport")

const router = require("express").Router()
router.get("/logout",(req,res) => {
    req.logout();
    res.redirect("http://localhost:3000/login");
})
router.get("/login/failed", (req,res) => {
    res.status(401).json({
        success:false,
        message:"failure"
    })
})
router.get("/login/success", (req,res) => {
    if (req.user) {
        res.status(200).json(
            {success:true,
            message:"successfull",
            user:req.user,
            cookies: req.cookies
        }
        )

    }
})
router.get("/google", passport.authenticate("google", {scope: ["profile"]}))

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:5173/login",
    failureRedirect: "/login/failed"
}))
module.exports = router;