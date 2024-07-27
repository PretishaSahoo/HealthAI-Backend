const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, required: true },
    uid: { type: String, required: true },
    phone: { type: String, required: true },
    clinicAddress: { type: String, required: true },
    specialization: {
        type: [String],
        enum: ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry', 'Oncology', 'Orthopedics', 'General Surgery', 'Gynecology'],
        required: true
    },
    experience: { type: String, required: true },
    fees: { type: Number, required: true },
    workingHours: { type: Object, required: true }
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
