const mongoose = require('mongoose'); // Add this line

const grievanceSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' },
 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const Grievance = mongoose.model('Grievance', grievanceSchema);

module.exports = Grievance;
