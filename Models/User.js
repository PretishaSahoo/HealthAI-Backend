const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true },
    isAdmin:{type:Boolean , default:false},
    isDoctor:{type:Boolean , default:false},
    notification:{type:Array , default:[]},
    seennotification:{type:Array , default:[]}
});

const User = mongoose.model("User", UserSchema);
module.exports = User;