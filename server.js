require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const http = require('http');
const { Server } = require("socket.io");

const publicRoute = require('./routes/publicRoute');
const user = require('./routes/user');
const product = require('./routes/product');
const category = require('./routes/category');
const size = require('./routes/size');
const group = require('./routes/group');
const cart = require('./routes/cart');
const address = require('./routes/address');
const transaction = require('./routes/transaction');
const wallet = require('./routes/wallet');
const notification = require('./routes/notification');
const appointment = require('./routes/appointment');
const stripe = require('./routes/stripe');
const chat = require('./routes/chat');
const message = require('./routes/message');
const loyalty = require('./routes/loyalty');
const points = require('./routes/points');

const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', publicRoute);
app.use('/api/stripe', stripe);
app.use('/api/product', product);
app.use('/api/category', category);
app.use('/api/size', size);
app.use('/api/group', group);
app.use('/api/user', auth, user);
app.use('/api/cart', auth, cart);
app.use('/api/address', auth, address);
app.use('/api/transaction', auth, transaction);
app.use('/api/wallet', auth, wallet);
app.use('/api/notification', auth, notification);
app.use('/api/appointment', auth, appointment);
app.use('/api/chat', auth, chat);
app.use('/api/message', auth, message);
app.use('/api/loyalty', auth, loyalty);
app.use('/api/points', auth, points);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
});

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://testing-branch--flourishing-dango-ea5417.netlify.app",
    methods: ["GET", "POST", "DELETE"]
  }
});

io.on('connection', (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData.userId);
    socket.emit("connected")
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("new chat", (newChatReceived) => {
    if (!newChatReceived.users) return console.log("chat.users not defined");

    newChatReceived.users.forEach((user) => {
      if (user._id == newChatReceived.sender) return;

      socket.in(user._id).emit("chat recieved", newChatReceived);
    });
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

mongoose.connect(process.env.ATLAS_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log('Form running on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error)
  })