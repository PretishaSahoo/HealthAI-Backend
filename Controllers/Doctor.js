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
    await User.findOneAndUpdate({ uid }, { isDoctor: true, name, phone });
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
      const updatedUser = await User.findOneAndUpdate(
        {  uid: req.body.uid  },
        {email:req.body.email, phone :req.body.phone},
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
        
      res.status(200).json({ message: "Doctor profile updated successfully", doctor: updatedDoctor });
    } catch (error) {
      console.error("Error editing doctor profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  exports.fetchAllDoctors = async (req, res) => {
    try {
      const doctors = await Doctor.find({});
      res.status(200).json({ doctors });
    } catch (error) {
      console.error("Fetch all doctors error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.acceptAppointment = async (req, res) => {
    try {
        const { doctorUid, userUid, date, time } = req.body;
        const doctorUser = await User.findOne({ uid: doctorUid });
        const user = await User.findOne({ uid: userUid });

      let appointmentFound = false;
      
      doctorUser.appointments.forEach(appointment => {
          if (
              appointment.userUid === userUid &&
              appointment.date === date &&
              appointment.time === time
          ) {
              appointment.status = "Accepted";
              appointmentFound = true;
          }
      });

      user.appointments.forEach(appointment => {
          if (
              appointment.doctorUid === doctorUid &&
              appointment.date === date &&
              appointment.time === time
          ) {
              appointment.status = "Accepted";
              appointmentFound = true;
          }
      });

      if (appointmentFound) {
            doctorUser.notifications.push(`You have accepted an appointment with ${user.name} on ${date} at ${time}`);
            user.notifications.push(`Your appointment with Dr. ${doctorUser.name} on ${date} at ${time} has been accepted`);
            await doctorUser.save();
            await user.save();

            res.status(200).json({ message: "Appointment accepted successfully!" });
        } else {
            res.status(404).json({ message: "Appointment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.rejectAppointment = async (req, res) => {
  try {
      const { doctorUid, userUid, date, time } = req.body;
      
      const doctorUser = await User.findOne({ uid: doctorUid });
      const user = await User.findOne({ uid: userUid });

      let appointmentFound = false;
      
      doctorUser.appointments.forEach(appointment => {
          if (
              appointment.userUid === userUid &&
              appointment.date === date &&
              appointment.time === time
          ) {
              appointment.status = "Rejected";
              appointmentFound = true;
          }
      });

      user.appointments.forEach(appointment => {
          if (
              appointment.doctorUid === doctorUid &&
              appointment.date === date &&
              appointment.time === time
          ) {
              appointment.status = "Rejected";
              appointmentFound = true;
          }
      });

      if (appointmentFound) {
          doctorUser.notifications.push(`You have rejected an appointment with ${user.name} on ${date} at ${time}`);
          user.notifications.push(`Your appointment with Dr. ${doctorUser.name} on ${date} at ${time} has been rejected`);

          await doctorUser.save();
          await user.save();

          res.status(200).json({ message: "Appointment rejected successfully!" });
      } else {
          res.status(404).json({ message: "Appointment not found" });
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};
