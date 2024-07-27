const User = require("../Models/User");

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
            res.status(200).json({ exists: true, user });
        } else {
            res.status(200).json({ exists: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Fetch user error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
