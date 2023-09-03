const passport = require("passport")
const User = require("../models/user")
const router = require("express").Router()


router.post("/login", (req, res, next) => {
    passport.authenticate("local", function (err,user,info) {
        if (err) {
            return res.status(401).json(err);
        }
        if (!user) { 
            return res.status(401).json(info); 
        }
    
        req.logIn(user, function (err) {
            console.log(user)
            if (err) { return next(err); }
            return res.status(201).json(user);
        });
    
    })(req, res, next);
  });

module.exports = router;