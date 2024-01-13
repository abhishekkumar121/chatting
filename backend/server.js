const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();
const app = express();
//the below is telling the  backend to take json data
app.use(express.json());

//making simple API
// app.get("/", (req, res) => {
//   res.send("api is successfully running");
// });

// //making complex API
// app.get("/api/chats", (req, res) => {
//   res.send(chats);
// });

// //getting only single chats using id
// app.get("/api/chats/:id", (req, res) => {
//   //   console.log(req);
//   const id = req.params.id;
//   const singleChat = chats.find((chat) => chat._id === id);
//   res.send(singleChat);
// });

//making end point for user and making userRoutes file and extracting the logic from it
app.use("/api/user", userRoutes);

//making api for chat creation
app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

// -------------------deployment-----------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("api is successfully running");
  });
}

//--------------------deployment-----------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

//for i dont want to show my port number
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server started on PORT ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  //cleaning the socket , beacause it is taking bandwidth more
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
