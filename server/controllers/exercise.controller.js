const { Exercise, TreatmentPlan, TreatmentPlanExercise } = require('../models/postgres');

// Get all exercises
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      where: { isActive: true }
    });
    
    return res.status(200).json(exercises);
  } catch (error) {
    console.error('Get all exercises error:', error);
    return res.status(500).json({ message: 'Server error while fetching exercises' });
  }
};

// Get exercise by ID
const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exercise = await Exercise.findByPk(id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    return res.status(200).json(exercise);
  } catch (error) {
    console.error('Get exercise by ID error:', error);
    return res.status(500).json({ message: 'Server error while fetching exercise' });
  }
};

// Create a new exercise (admin or physiotherapist only)
const createExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      targetArea,
      instructions,
      demoVideoUrl,
      thumbnailUrl
    } = req.body;
    
    // Check if user is authorized
    if (req.user.role !== 'admin' && req.user.role !== 'physiotherapist') {
      return res.status(403).json({ message: 'Not authorized to create exercises' });
    }
    
    // Create exercise
    const exercise = await Exercise.create({
      name,
      description,
      category,
      difficulty,
      targetArea,
      instructions,
      demoVideoUrl,
      thumbnailUrl
    });
    
    return res.status(201).json(exercise);
  } catch (error) {
    console.error('Create exercise error:', error);
    return res.status(500).json({ message: 'Server error while creating exercise' });
  }
};

// Update exercise
const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      difficulty,
      targetArea,
      instructions,
      demoVideoUrl,
      thumbnailUrl,
      isActive
    } = req.body;
    
    // Check if user is authorized
    if (req.user.role !== 'admin' && req.user.role !== 'physiotherapist') {
      return res.status(403).json({ message: 'Not authorized to update exercises' });
    }
    
    // Check if exercise exists
    const exercise = await Exercise.findByPk(id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Update exercise
    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      category: category || exercise.category,
      difficulty: difficulty || exercise.difficulty,
      targetArea: targetArea || exercise.targetArea,
      instructions: instructions || exercise.instructions,
      demoVideoUrl: demoVideoUrl || exercise.demoVideoUrl,
      thumbnailUrl: thumbnailUrl || exercise.thumbnailUrl,
      isActive: isActive !== undefined ? isActive : exercise.isActive
    });
    
    return res.status(200).json(exercise);
  } catch (error) {
    console.error('Update exercise error:', error);
    return res.status(500).json({ message: 'Server error while updating exercise' });
  }
};

// Get exercises by category
const getExercisesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const exercises = await Exercise.findAll({
      where: { category, isActive: true }
    });
    
    return res.status(200).json(exercises);
  } catch (error) {
    console.error('Get exercises by category error:', error);
    return res.status(500).json({ message: 'Server error while fetching exercises by category' });
  }
};

// Get exercises for a user's treatment plan
const getUserExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get active treatment plans for the user
    const treatmentPlans = await TreatmentPlan.findAll({
      where: { patientId: userId, status: 'active' }
    });
    
    if (!treatmentPlans.length) {
      return res.status(200).json([]);
    }
    
    // Get all exercises from all active treatment plans
    const treatmentPlanIds = treatmentPlans.map(plan => plan.id);
    
    const treatmentPlanExercises = await TreatmentPlanExercise.findAll({
      where: { treatmentPlanId: treatmentPlanIds },
      include: [{ model: Exercise }],
      order: [['order', 'ASC']]
    });
    
    // Format response
    const exercises = treatmentPlanExercises.map(tpe => ({
      ...tpe.Exercise.dataValues,
      sets: tpe.sets,
      reps: tpe.reps,
      frequency: tpe.frequency,
      duration: tpe.duration,
      notes: tpe.notes,
      treatmentPlanId: tpe.treatmentPlanId
    }));
    
    return res.status(200).json(exercises);
  } catch (error) {
    console.error('Get user exercises error:', error);
    return res.status(500).json({ message: 'Server error while fetching user exercises' });
  }
};

module.exports = {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  getExercisesByCategory,
  getUserExercises
};
