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
const Messenger = require("./models/message");
const userRouter = require("./routes/userRouter");
const FriendRouter = require("./routes/friendRequestRouter");
const messageRouter = require("./routes/messageRouter")

// Load environment variables
require("dotenv").config();
require("./googleAuth")

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
  origin: "http://localhost:5173", // Adjust this to your frontend's URL
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}));

// Socket.io initialization (as you've correctly done)
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173", // Adjust this to your frontend's URL
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
socketIO.on('connection', (socket) => {
  const username = socket.handshake.query.username;
  connectedUsers[username] = socket;

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

  socket.on('disconnect', () => {
    delete connectedUsers[username];
  });
});

// Define routes
app.use("/users", userRouter);
app.use("/auth", authRoute);
app.use("/friend-request", FriendRouter);
app.use("/messages",messageRouter)

// Start the server
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});




