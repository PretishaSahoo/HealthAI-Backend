const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectToMongo = require("./db");

const isLocal = process.env.MODE === 'development';

dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://health-ai-teal.vercel.app"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.options("*", cors({
    origin: ["http://localhost:3000", "https://health-ai-teal.vercel.app"],
    methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://health-ai-teal.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);
});

app.get("/", (req, res) => {
    res.send("Server");
});

connectToMongo();

const UserRouter = require("./Routes/User");
const DoctorRouter = require("./Routes/Doctor");

app.use("/api/user", UserRouter.router);
app.use("/api/doctor", DoctorRouter.router);

if (isLocal) {
    const cron = require('node-cron');
    const checkAndSendReminders = require('./NotificationManagement/Notifications');

    cron.schedule('* * * * *', () => {
        checkAndSendReminders();
    });
}

server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
