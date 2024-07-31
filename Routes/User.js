const express = require("express");

const { fetchUser, createUser, bookAppointment } = require("../Controllers/User");

const router = express.Router();

router.post("/fetchuser" , fetchUser)
router.post("/signup" , createUser)
router.post("/bookAppointment" , bookAppointment)

exports.router = router;
   