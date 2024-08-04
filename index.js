const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./db");
const checkAndSendReminders = require('./NotificationManagement/Notifications'); 
const cron = require('node-cron');
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://health-ai-teal.vercel.app"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.options("", cors({
    origin: ["http://localhost:3000", "https://health-ai-teal.vercel.app"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server");
});

connectToMongo();

const UserRouter = require("./Routes/User");
const DoctorRouter = require("./Routes/Doctor");

app.use("/api/user", UserRouter.router);
app.use("/api/doctor", DoctorRouter.router);

// Scheduled the checkAndSendReminders function to run every minute
cron.schedule('* * * * *', () => {
    checkAndSendReminders();
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://health-ai-teal.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});


const rooms = new Map();
io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);
  
    socket.on("join", ({ doctorUid, userUid, room }) => {
      if (!rooms.has(room)) {
        rooms.set(room, { doctor: null, user: null });
      }
  
      let role;
      if (doctorUid) {
        role = 'doctor';
      } else if (userUid) {
        role = 'user';
      } else {
        socket.emit("error", { message: "No valid role provided." });
        return;
      }
  
      const roomInfo = rooms.get(room);
  
      if (roomInfo[role]) {
        socket.emit("error", { message: "Room is already occupied by someone else." });
        return;
      }
  
      roomInfo[role] = socket.id;
      socket.join(room);
  
      io.to(room).emit("user-joined", { id: socket.id, role });
  
      socket.on("stream", (stream) => {
        socket.to(room).emit("stream", stream); // Broadcast stream to other users
      });
  
      socket.on("disconnect", () => {
        console.log(`Socket Disconnected: ${socket.id}`);
        const roomInfo = rooms.get(room);
        if (roomInfo) {
          if (roomInfo.doctor === socket.id) {
            roomInfo.doctor = null;
          } else if (roomInfo.user === socket.id) {
            roomInfo.user = null;
          }
  
          if (!roomInfo.doctor && !roomInfo.user) {
            rooms.delete(room);
          }
          io.to(room).emit("user-left", { id: socket.id });
        }
      });
    });
  });
  
server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
