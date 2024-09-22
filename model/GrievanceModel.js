const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  status: { type: String, default: 'Pending' },
  resolutions: [{ response: String, date: Date }],
});


const Grievance = mongoose.model('Grievance', GrievanceSchema);
module.exports = Grievance;
