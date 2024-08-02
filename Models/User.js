const mongoose = require('mongoose');

const MedicineReminderSchema = new mongoose.Schema({
  medicine: { type: String, required: true }, 
  time: { type: String, required: true }, 
});

const AppointmentSchema = new mongoose.Schema({
  doctorUid: { type: String, required: true },
  doctorName: { type: String, required: true },
  userUid: { type: String, required: true },
  userName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, enum: ['Scheduled', 'Completed', 'Cancelled', 'Accepted', 'Rejected'], default: 'Scheduled' },
  videoCallLink: { type: String },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  uid: { type: String, required: true },
  isDoctor: { type: Boolean, default: false },
  notifications: { type: [String], default: [] },
  seenNotifications: { type: [String], default: [] },
  medicineReminders: { type: [MedicineReminderSchema], default: [] },
  appointments: { type: [AppointmentSchema], default: [] },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;