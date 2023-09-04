const passport = require("passport")
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require("dotenv").config();
const User = require("../models/user")
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const newUser = new User(
        {
        username:"gmail",
        name:profile.displayName,
        friend_list: [],
        image_url: profile.picture,
        email: profile.email
    })
    const findUser = await User.findOne({email: profile.email});
    if(!findUser){
        await newUser.save()
        done(null,profile)

    }
    else {
        done(null,profile)
    }
  }
));


passport.serializeUser((user,done) => {
    done(null, user);
})

passport.deserializeUser((user,done) => {
    done(null, user);
})