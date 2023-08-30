const express = require('express');
const app = express();
const PORT = 3000;

const http = require('http').Server(app);
const cors = require('cors');
const cookieSession = require("cookie-session");
const passport = require('passport');
const authRoute = require("./routes/authRouter");

require("./googleAuth")
app.use(cors());
app.use(cookieSession({
  name:"session",
  keys:["cat"],
  maxAge: 24*60*60*100
}))

app.use(passport.initialize());
app.use(passport.session()); 
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}))
// const socketIO = require('socket.io')(http, {
//     cors: {
//         origin: "http://localhost:5173"
//     }
// });

// //Add this before the app.get() block
// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);
//     socket.on('disconnect', () => {
//       console.log('🔥: A user disconnected');
//     });
// });

app.use("/auth", authRoute);
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});