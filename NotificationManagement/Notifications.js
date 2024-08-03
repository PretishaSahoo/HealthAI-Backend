const cron = require('node-cron');
const User = require('../Models/User.js');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

// Function to send email reminder
const sendEmailReminder = (email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email,
    subject: 'Medicine Reminder',
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
};

// Function to check and send reminders
const checkAndSendReminders = async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Get current time in HH:MM format

  try {
    // Find all users with reminders at the current time
    const users = await User.find({ "medicineReminders.time": currentTime });

    users.forEach(user => {
      user.medicineReminders.forEach(reminder => {
        if (reminder.time === currentTime) {
          const message = `Reminder: It's time to take your medicine: ${reminder.medicine}.Take your medicines at time.Get well soon`;
          if (user.email) {
            sendEmailReminder(user.email, message);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error checking and sending reminders:', error);
  }
};

// Scheduled the cron job to run every minute to check and send notifications as an when needed.
cron.schedule('* * * * *', checkAndSendReminders);

module.exports = checkAndSendReminders;
