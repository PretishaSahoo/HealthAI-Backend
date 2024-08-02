const express = require("express");

const { fetchUser, createUser, bookAppointment, markNotificationAsRead, markAllNotificationsAsRead, addMedicine, deleteMedicine } = require("../Controllers/User");

const router = express.Router();

router.post("/fetchuser" , fetchUser)
router.post("/signup" , createUser)
router.post("/bookAppointment" , bookAppointment)
router.post('/markNotificationAsRead', markNotificationAsRead);
router.post('/markAllNotificationsAsRead', markAllNotificationsAsRead);
router.post("/addMedicineReminder",addMedicine);
router.post("/deleteMedicineReminder" ,deleteMedicine);

exports.router = router;
   