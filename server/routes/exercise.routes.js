const express = require('express');
const {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  getExercisesByCategory,
  getUserExercises
} = require('../controllers/exercise.controller');
const { verifyToken, isPhysiotherapist } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all exercises
router.get('/', verifyToken, getAllExercises);

// Get exercises for a user's treatment plan
router.get('/user', verifyToken, getUserExercises);

// Get exercises by category
router.get('/category/:category', verifyToken, getExercisesByCategory);

// Get exercise by ID
router.get('/:id', verifyToken, getExerciseById);

// Create a new exercise (admin or physiotherapist only)
router.post('/', verifyToken, isPhysiotherapist, createExercise);

// Update exercise
router.put('/:id', verifyToken, isPhysiotherapist, updateExercise);

module.exports = router;
