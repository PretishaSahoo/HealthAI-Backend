const express = require("express");
const router = express.Router() ;

const {applyDoctor , editDoctor} = require("../Controllers/Doctor.js")

router.post("/applyDoctor" ,applyDoctor);
router.post("/editDoctor" , editDoctor)

exports.router = router;