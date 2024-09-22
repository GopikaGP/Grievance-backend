// Import express
const express = require('express');
const jwtMiddleware = require('./middleware/jwtMiddleware');
const adminController = require('./controller/AdminController');
const grievanceController = require('./controller/GrievanceController');


// Create a router object
const router = new express.Router();

// Define routes
router.post('/register', adminController.registerController);
router.post('/login', adminController.loginController);
// User login




// Grievance routes
router.post('/submit', grievanceController.submitGrievance);
router.get('/all', grievanceController.getAllGrievances);

// Admin dashboard (with middleware)
router.get('/admin-dashboard', jwtMiddleware, adminController.getAdminDashboard);

// Grievance routes
router.get('/grievances', grievanceController.getAllGrievances);
router.put('/grievances/:id', grievanceController.updateGrievanceStatus);
router.get('/grievances/:id', grievanceController.getGrievanceById);

// Reply to a grievance
router.post('/grievances/:id/reply', grievanceController.replyToGrievance);

// Check grievance status by ID
router.get('/grievances/status/:id', grievanceController.getGrievanceById);

// Submit a resolution
router.post('/grievances/:id/resolution', grievanceController.submitResolution);

// Get all resolutions for a specific grievance
router.get('/grievances/:id/resolutions', grievanceController.getResolutionsByGrievanceId);

// Export the router
module.exports = router;
