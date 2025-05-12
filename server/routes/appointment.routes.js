const express = require('express');
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  getUpcomingAppointments
} = require('../controllers/appointment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Create a new appointment
router.post('/', verifyToken, createAppointment);

// Get all appointments for a user
router.get('/', verifyToken, getUserAppointments);

// Get upcoming appointments
router.get('/upcoming', verifyToken, getUpcomingAppointments);

// Get appointment by ID
router.get('/:id', verifyToken, getAppointmentById);

// Update appointment
router.put('/:id', verifyToken, updateAppointment);

module.exports = router;
