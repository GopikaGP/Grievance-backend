const mongoose = require('mongoose');

// Define the schema
const AdminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin' // Default role is 'admin'
    }
});

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
module.exports = AdminUser;
