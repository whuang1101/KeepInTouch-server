const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const cors = require('cors');
const cookieSession = require("cookie-session");
const passport = require('passport');
const authRoute = require("./routes/authRouter");
const mongoose = require("mongoose");
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const Messenger = require("./models/message");
const userRouter = require("./routes/userRouter");
const FriendRouter = require("./routes/friendRequestRouter");
const messageRouter = require("./routes/messageRouter")
const localAuthRouter = require("./routes/localRouter")

// Load environment variables
require("dotenv").config();
require("./passport/googleAuth");
require("./passport/localAuth")(passport);


// MongoDB connection
const mongoDb = process.env.SECRET_KEY;

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(express.json());
app.use(cookieSession({
  name: "session",
  keys: ["cat"],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
}));

// Sessions initialization
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", 
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}));

// Socket.io initialization (as you've correctly done)
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173", 
  },
});

const connectedUsers = {};

function findSocketByUsername(username) {

  const user = connectedUsers[username];
  if (user) {
    return user;
  }
  else
  {return null;}
}

// Socket.io connection handling
socketIO.on('connection', async(socket) => {
  const username = socket.handshake.query.username;
  connectedUsers[username] = socket;
  const onlineUser = await User.findByIdAndUpdate(username, { online: true });
  socket.on('chat message', (message) => {
    socketIO.emit('chat message', message);
  });

  socket.on('private message', ({ id, message }) => {
    const recipientSocket = findSocketByUsername(id);
    if (recipientSocket) {
      recipientSocket.emit("private message", message);
    } else {
      socket.emit("error", "Recipient not found or offline");
    }
  })

  socket.on('disconnect', async() => {
    const onlineUser = await User.findOneAndUpdate(
      { _id: username }, 
      { online: false, last_online: new Date() },
      { new: true } 
    );
        delete connectedUsers[username];
  });
});

// Define routes
app.use("/", localAuthRouter)
app.use("/users", userRouter);
app.use("/auth", authRoute);
app.use("/friend-request", FriendRouter);
app.use("/messages",messageRouter)

// Start the server
app.listen(port, "0.0.0.0", function () {
  console.log(`hosting on ${port}`)
});

