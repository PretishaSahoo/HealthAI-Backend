const express = require("express");

const { fetchUser, createUser } = require("../Controllers/User");

const router = express.Router();

router.post("/fetchuser" , fetchUser)
router.post("/signup" , createUser)

exports.router = router;
   