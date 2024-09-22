
const adminUSer = require('../model/AdminUSer')
const jwt = require('jsonwebtoken')
const Grievance = require('../model/GrievanceModel');


exports.registerController = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await adminUSer.findOne({ email });
        if (existingUser) {
            return res.status(406).json('Account already exists');
        }

        const newUser = new adminUSer({
            username,
            email,
            password,  // Store password in plain text
            role: 'admin'
        });

        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            'supersecretkey',
            { expiresIn: '1h' }
        );

        res.status(200).json({ user: newUser, token });
    } catch (error) {
        res.status(400).json(`Registration failed due to: ${error.message}`);
    }
};



exports.loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await adminUSer.findOne({ email });
        if (!existingUser) {
            return res.status(406).json('Invalid email or password');
        }

        console.log('Password provided:', password);
        console.log('Stored password:', existingUser.password);

        // Compare passwords directly (plain text)
        if (password !== existingUser.password) {
            return res.status(406).json('Invalid email or password');
        }

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            'supersecretkey',
            { expiresIn: '1h' }
        );

        res.status(200).json({ existingUser, token });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(401).json(`Login failed due to: ${error.message}`);
    }
};








exports.getAdminDashboard = async (req, res) => {
    try {
        // Fetch all grievances from the database
        const grievances = await Grievance.find();
        res.status(200).json(grievances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grievances", error });
    }
};

// Admin action to resolve a grievance
exports.resolveGrievance = async (req, res) => {
    const { grievanceId } = req.params;
    try {
        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        grievance.status = 'Resolved';
        await grievance.save();
        res.status(200).json({ message: 'Grievance resolved', grievance });
    } catch (error) {
        res.status(500).json({ message: 'Error resolving grievance', error });
    }
};

// Admin action to reject a grievance
exports.rejectGrievance = async (req, res) => {
    const { grievanceId } = req.params;
    try {
        const grievance = await Grievance.findById(grievanceId);
        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        grievance.status = 'Rejected';
        await grievance.save();
        res.status(200).json({ message: 'Grievance rejected', grievance });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting grievance', error });
    }
};
