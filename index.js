const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./db");
const checkAndSendReminders = require('./NotificationManagement/Notifications'); 
const cron = require('node-cron');

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

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

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