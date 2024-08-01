const express = require("express");
const router = express.Router() ;

const {applyDoctor , editDoctor ,fetchAllDoctors, acceptAppointment, rejectAppointment} = require("../Controllers/Doctor.js")

router.post("/applyDoctor" ,applyDoctor);
router.post("/editDoctor" , editDoctor);
router.get('/fetchAllDoctors',fetchAllDoctors);
router.post("/accept" , acceptAppointment);
router.post("/reject" ,rejectAppointment);

exports.router = router;