const Doctor = require("../Models/Doctor.js");
const User = require("../Models/User.js");

exports.applyDoctor = async (req, res) => {
  const { name, email, uid, phone, clinicAddress, specialization, experience, fees, workingHours, profilePic } = req.body;
  try {
    const existingDoctor = await Doctor.findOne({ uid });
    if (existingDoctor) {
      return res.status(400).json({ message: "User is already a doctor." });
    }
    const newDoctor = new Doctor({
      name,
      email,
      profilePic,
      uid,
      phone,
      clinicAddress,
      specialization,
      experience,
      fees,
      workingHours,
    });
    await newDoctor.save();
    await User.findOneAndUpdate({ uid }, { isDoctor: true });
    res.status(201).json({ message: "Applied as doctor successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error applying as a  doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editDoctor = async (req, res) => {
    try {
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { uid: req.body.uid },
        req.body,
        { new: true }
      );
  
      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.status(200).json({ message: "Doctor profile updated successfully", doctor: updatedDoctor });
    } catch (error) {
      console.error("Error editing doctor profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
