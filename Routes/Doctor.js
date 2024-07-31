const express = require("express");
const router = express.Router() ;

const {applyDoctor , editDoctor ,fetchAllDoctors} = require("../Controllers/Doctor.js")

router.post("/applyDoctor" ,applyDoctor);
router.post("/editDoctor" , editDoctor);
router.get('/fetchAllDoctors',fetchAllDoctors);

exports.router = router;