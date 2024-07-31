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
            const appointment = {
                doctorUid : doctorUid  ,
                userUid : userUid , 
                date :date ,
                time :time ,
                status :"Scheduled",
                videoCallLink:""
            }
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
