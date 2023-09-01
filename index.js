
// initializing dependencies
const express = require('express');
const app = express();
const PORT = 3000;
const http = require('http').Server(app);
const cors = require('cors');
const cookieSession = require("cookie-session");
const passport = require('passport');
const authRoute = require("./routes/authRouter");
const mongoose = require("mongoose");
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const userRouter = require("./routes/userRouter");
const FriendRouter = require("./routes/friendRequestRouter");

// Making enviornment variables so sensitive information isn't leaked
require("dotenv").config();
require("./googleAuth")
mongoDb = process.env.SECRET_KEY;

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


app.use(express.json());
app.use(cookieSession({
  name:"session",
  keys:["cat"],
  maxAge: 24*60*60*100
}))

// sessions initialized so people can stay logged in
app.use(passport.initialize());
app.use(passport.session()); 

// make sure the front end can communicate with it 
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}))

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
  const username = socket.handshake.query.username;
    console.log(`⚡: ${username} user just connected!`);
    socket.on('disconnect', () => {
      console.log(`🔥: ${username}disconnected`);
    });
});

// using routers
app.use("/users",userRouter)
app.use("/auth", authRoute);
app.use("/friend-request",FriendRouter)


http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});