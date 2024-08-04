const checkAndSendReminders = require('../NotificationManagement/Notifications');

module.exports = async (req, res) => {
  try {
    await checkAndSendReminders();
    res.status(200).json({ message: 'Reminders processed' });
  } catch (error) {
    console.error('Error in scheduled function:', error);
    res.status(500).json({ message: 'Error processing reminders' });
  }
};
