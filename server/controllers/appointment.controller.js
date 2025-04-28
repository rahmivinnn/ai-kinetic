const { Appointment, User } = require('../models/postgres');
const { Op } = require('sequelize');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { physiotherapistId, startTime, endTime, type, notes } = req.body;
    const patientId = req.user.id;
    
    // Check if physiotherapist exists
    const physiotherapist = await User.findOne({
      where: { id: physiotherapistId, role: 'physiotherapist' }
    });
    
    if (!physiotherapist) {
      return res.status(404).json({ message: 'Physiotherapist not found' });
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      physiotherapistId,
      startTime,
      endTime,
      type,
      notes,
      status: 'scheduled',
      meetingLink: type === 'video_call' ? `https://meet.kinetic-ai.com/${Date.now()}` : null
    });
    
    return res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    return res.status(500).json({ message: 'Server error while creating appointment' });
  }
};

// Get all appointments for a user
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let appointments;
    
    if (userRole === 'patient') {
      // Get patient's appointments
      appointments = await Appointment.findAll({
        where: { patientId: userId },
        include: [
          {
            model: User,
            as: 'physiotherapist',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          }
        ],
        order: [['startTime', 'DESC']]
      });
    } else if (userRole === 'physiotherapist') {
      // Get physiotherapist's appointments
      appointments = await Appointment.findAll({
        where: { physiotherapistId: userId },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          }
        ],
        order: [['startTime', 'DESC']]
      });
    } else {
      // Admin can see all appointments
      appointments = await Appointment.findAll({
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          },
          {
            model: User,
            as: 'physiotherapist',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          }
        ],
        order: [['startTime', 'DESC']]
      });
    }
    
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Get user appointments error:', error);
    return res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
        },
        {
          model: User,
          as: 'physiotherapist',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
        }
      ]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to view this appointment
    if (
      userRole !== 'admin' &&
      appointment.patientId !== userId &&
      appointment.physiotherapistId !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    return res.status(500).json({ message: 'Server error while fetching appointment' });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, status, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to update this appointment
    if (
      userRole !== 'admin' &&
      appointment.patientId !== userId &&
      appointment.physiotherapistId !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    
    // Update appointment
    await appointment.update({
      startTime: startTime || appointment.startTime,
      endTime: endTime || appointment.endTime,
      status: status || appointment.status,
      notes: notes || appointment.notes
    });
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    return res.status(500).json({ message: 'Server error while updating appointment' });
  }
};

// Get upcoming appointments
const getUpcomingAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const now = new Date();
    
    let appointments;
    
    if (userRole === 'patient') {
      // Get patient's upcoming appointments
      appointments = await Appointment.findAll({
        where: {
          patientId: userId,
          startTime: { [Op.gt]: now },
          status: { [Op.ne]: 'cancelled' }
        },
        include: [
          {
            model: User,
            as: 'physiotherapist',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          }
        ],
        order: [['startTime', 'ASC']],
        limit: 5
      });
    } else if (userRole === 'physiotherapist') {
      // Get physiotherapist's upcoming appointments
      appointments = await Appointment.findAll({
        where: {
          physiotherapistId: userId,
          startTime: { [Op.gt]: now },
          status: { [Op.ne]: 'cancelled' }
        },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
          }
        ],
        order: [['startTime', 'ASC']],
        limit: 5
      });
    }
    
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    return res.status(500).json({ message: 'Server error while fetching upcoming appointments' });
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  getUpcomingAppointments
};
