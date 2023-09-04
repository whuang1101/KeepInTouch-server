const passport = require("passport")
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require("dotenv").config();
const User = require("../models/user")
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://red-silence-64.fly.dev/auth/google/callback",
    passReqToCallback   : true
  },
  // add console logs to check what is broken sad.
  async function(request, accessToken, refreshToken, profile, done) {
 
    const newUser = new User(
        {
        username:"gmail",
        name:profile.displayName,
        friend_list: [],
        image_url: profile.picture,
        email: profile.email
    })
    console.log(profile)
    const findUser = await User.findOne({email: profile.email});
    if(!findUser){
        console.log("we are here")
        await newUser.save()
        done(null,profile)

    }
    else {
        console.log("we are")
        done(null,profile)
    }
  }
  
));


passport.serializeUser((user,done) => {
    console.log("this works as well")
    done(null, user);
})

passport.deserializeUser((user,done) => {
    done(null, user);
})