const Grievance = require('../model/GrievanceModel'); // Ensure correct path
const nodemailer = require('nodemailer');




// Create the transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email notifications
const sendEmailNotification = async (toEmail, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.submitGrievance = async (req, res) => {
  const { name, email, description } = req.body;

  try {
    const grievance = new Grievance({ name, email, description });
    const savedGrievance = await grievance.save();

    // Send notification email to superhero
    const superheroSubject = 'New Grievance Submitted';
    const superheroText = `A new grievance has been submitted by ${name}.\n\nDescription: ${description}`;
    await sendEmailNotification(process.env.SUPERHERO_EMAIL, superheroSubject, superheroText);

    // Send confirmation email to user
    const userSubject = 'Complaint Received';
    const userText = `Dear ${name},\n\ We have received a complaint reagrds you.\n\nDescription:\n${description}\n\nBest regards,\nSuperhero Team`;
    await sendEmailNotification(email, userSubject, userText);

    res.status(201).json(savedGrievance);
  } catch (error) {
    console.error('Error submitting grievance:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    console.log('Fetched grievances:', grievances); // Add this line
    res.status(200).json(grievances);
  } catch (error) {
    console.log('Error retrieving grievances:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update grievance status
exports.updateGrievanceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedGrievance = await Grievance.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedGrievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    res.status(200).json(updatedGrievance);
  } catch (error) {
    console.error('Error updating grievance status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getGrievanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.replyToGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    // Log the received reply
    console.log('Reply data:', response); 

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    grievance.reply = response;
    grievance.status = 'Resolved';
    await grievance.save();

    res.status(200).json({ message: 'Reply added successfully' });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Error adding reply', error });
  }
};

exports.submitResolution = async (req, res) => {
  const { id } = req.params;
  const { resolution } = req.body;

  try {
    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Push the resolution into the resolutions array
    grievance.resolutions.push({ response: resolution, date: new Date() });

    // Optionally, update the status to "Resolved"
    grievance.status = 'Resolved';

    // Save the updated grievance
    await grievance.save();

    return res.status(200).json({ message: 'Resolution submitted successfully', grievance });
  } catch (error) {
    console.error('Error submitting resolution:', error);
    return res.status(500).json({ message: 'Failed to submit resolution' });
  }
};

exports.getResolutionsByGrievanceId = async (req, res) => {
  const { id } = req.params; // Changed to 'id' to match route parameter

  try {
      const grievance = await Grievance.findById(id);
      if (!grievance) {
          return res.status(404).json({ message: 'Grievance not found' });
      }
      res.status(200).json(grievance.resolutions); // Return the resolutions array from the grievance
  } catch (error) {
      console.error('Error retrieving resolutions:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};



