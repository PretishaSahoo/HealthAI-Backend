const User = require("../Models/User");
const Doctor = require("../Models/Doctor")

exports.createUser = async (req, res) => {
    const { uid, name, email } = req.body;
    try {
        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User({ uid, name, email });
        const doc = await user.save();
        res.status(201).json({ user: doc });
    } catch (err) {
        console.error('Create user error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }  
}
exports.fetchUser = async (req, res) => {
    const { uid } = req.body;
    try {
        const user = await User.findOne({ uid });
        
        if (user) {
            let userData = { ...user.toObject() }; // Convert Mongoose document to plain object
            if (user.isDoctor) {
                const doctor = await Doctor.findOne({ uid });
                if (doctor) {
                    // Merge user and doctor details
                    userData = { ...userData, doctorDetails: doctor.toObject() };
                }
            }
            res.status(200).json({ exists: true, user: userData });
        } else {
            res.status(200).json({ exists: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Fetch user error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const generateRoomCode = ()=>{
  const seq = "qwertyuiopasdfghjklzxcvbnm1234567890"
  let code = "";
  for(let i = 0 ; i<10; i++){
      let randomIdx =Math.floor( Math.random() * seq.length) ;
      code += seq[randomIdx];
  }
  return code;
}

exports.bookAppointment = async(req,res)=>{
    try {
        const {doctorUid , userUid , date ,time } = req.body ;
        const doctor = await Doctor.findOne({uid : doctorUid});
        const doctorUser = await User.findOne({uid : doctorUid});
        const user = await User.findOne({uid : userUid});
        if (doctor.workingHours.start>time || doctor.workingHours.end<time  ){
            res.status(200).json({message:"Oops this time slot is not available !"})
        }
        else{
            const code = await generateRoomCode();
            const appointment = {
                doctorUid: doctorUid,
                doctorName: doctorUser.name,
                userUid: userUid,
                userName: user.name,
                date: date,
                time: time,
                status: "Scheduled",
                videoCallLink: code
            };
            doctorUser.notifications.push(`An appointment is requested by ${user.name} on ${date } at ${time}`);
            doctorUser.appointments.push(appointment);
            user.notifications.push(`Your appointment requested successfully to Dr. ${doctorUser.name} on ${date } at ${time}. Kindly wait for Doctors approval`);
            user.appointments.push(appointment);
            doctorUser.save() ;
            user.save() ;
            res.status(200).json({message:"Appointment Scheduled Successfully!"});
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.markNotificationAsRead = async (req, res) => {
  try {
    const { uid, notification } = req.body;

    const user = await User.findOne({ uid });
    if (user) {
      user.notifications = user.notifications.filter(n => n !== notification);
      if (!user.seenNotifications.includes(notification)) {
        user.seenNotifications.push(notification);
      }
      await user.save();

      res.status(200).json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { uid } = req.body;

    const user = await User.findOne({ uid });
    if (user) {
      user.notifications.forEach(notification => {
        if (!user.seenNotifications.includes(notification)) {
          user.seenNotifications.push(notification);
        }
      });
      user.notifications = [];
      await user.save();

      res.status(200).json({ message: 'All notifications marked as read' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addMedicine = async (req, res) => {
    try {
      const { medicine, time, uid } = req.body;
      const user = await User.findOne({ uid }); 
  
      if (user) {
        user.medicineReminders.push({ medicine, time });
        user.notifications.push(`Medicine Reminder Added: ${medicine} at ${time}`);
        await user.save();
        res.status(200).json({ message: 'Medicine reminder added successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  exports.deleteMedicine = async (req, res) => {
    try {
      const { medicine, time, uid } = req.body;
      const user = await User.findOne({ uid }); 
  
      if (user) {
        user.medicineReminders = user.medicineReminders.filter(
          (reminder) => !(reminder.medicine === medicine && reminder.time === time)
        );
        user.notifications.push(`Medicine Reminder Removed: ${medicine} at ${time}`);
        await user.save();
        res.status(200).json({ message: 'Medicine reminder deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  