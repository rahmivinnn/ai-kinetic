const express = require('express');
const {
  generateExercisePlan,
  getPatientInsights
} = require('../controllers/ai.controller');
const { verifyToken, isPhysiotherapist } = require('../middleware/auth.middleware');

const router = express.Router();

// Generate an AI exercise plan for a patient
router.post('/exercise-plan/:patientId', verifyToken, isPhysiotherapist, generateExercisePlan);

// Get AI-generated insights for a patient
router.get('/insights/:patientId', verifyToken, getPatientInsights);

module.exports = router;
