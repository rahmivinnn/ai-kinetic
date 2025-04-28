const { TreatmentPlan, TreatmentPlanExercise, Exercise, User } = require('../models/postgres');
const { VideoAnalysis } = require('../models/mongodb');

// Generate an AI exercise plan for a patient
const generateExercisePlan = async (req, res) => {
  try {
    const { patientId } = req.params;
    const physiotherapistId = req.user.id;
    
    // Check if user is a physiotherapist
    if (req.user.role !== 'physiotherapist' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only physiotherapists can generate exercise plans' });
    }
    
    // Check if patient exists
    const patient = await User.findOne({
      where: { id: patientId, role: 'patient' }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get patient's video analyses to inform the exercise plan
    const analyses = await VideoAnalysis.find({ userId: patientId }).sort({ createdAt: -1 }).limit(5);
    
    // Get appropriate exercises based on analyses
    // In a real system, this would use ML to select exercises
    // For now, we'll simulate this with a simple algorithm
    
    // Get all available exercises
    const allExercises = await Exercise.findAll({
      where: { isActive: true }
    });
    
    // Select exercises based on mock criteria
    const selectedExercises = [];
    
    // Simulate selecting exercises based on analysis
    if (analyses.length > 0) {
      // Use the most recent analysis to determine exercise needs
      const latestAnalysis = analyses[0];
      
      // Select exercises based on form score
      if (latestAnalysis.formScore < 70) {
        // Add beginner exercises
        const beginnerExercises = allExercises.filter(e => e.difficulty === 'beginner');
        selectedExercises.push(...beginnerExercises.slice(0, 3));
      } else if (latestAnalysis.formScore < 85) {
        // Add intermediate exercises
        const intermediateExercises = allExercises.filter(e => e.difficulty === 'intermediate');
        selectedExercises.push(...intermediateExercises.slice(0, 3));
      } else {
        // Add advanced exercises
        const advancedExercises = allExercises.filter(e => e.difficulty === 'advanced');
        selectedExercises.push(...advancedExercises.slice(0, 3));
      }
      
      // Add exercises for specific issues
      if (latestAnalysis.issues && latestAnalysis.issues.length > 0) {
        latestAnalysis.issues.forEach(issue => {
          if (issue.type === 'alignment') {
            const alignmentExercises = allExercises.filter(e => 
              e.targetArea.toLowerCase().includes('alignment') || 
              e.description.toLowerCase().includes('alignment')
            );
            if (alignmentExercises.length > 0) {
              selectedExercises.push(alignmentExercises[0]);
            }
          }
          
          if (issue.type === 'range') {
            const rangeExercises = allExercises.filter(e => 
              e.targetArea.toLowerCase().includes('range') || 
              e.description.toLowerCase().includes('range of motion')
            );
            if (rangeExercises.length > 0) {
              selectedExercises.push(rangeExercises[0]);
            }
          }
        });
      }
    } else {
      // No analyses available, select default exercises
      selectedExercises.push(...allExercises.slice(0, 5));
    }
    
    // Ensure we have at least 5 exercises
    if (selectedExercises.length < 5) {
      const remainingCount = 5 - selectedExercises.length;
      const selectedIds = selectedExercises.map(e => e.id);
      const remainingExercises = allExercises.filter(e => !selectedIds.includes(e.id));
      selectedExercises.push(...remainingExercises.slice(0, remainingCount));
    }
    
    // Create a new treatment plan
    const treatmentPlan = await TreatmentPlan.create({
      patientId,
      physiotherapistId,
      title: 'AI-Generated Exercise Plan',
      description: 'This exercise plan was automatically generated based on your movement patterns and progress.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      goals: 'Improve movement quality and address specific issues identified in your exercises.',
      isAIGenerated: true
    });
    
    // Add exercises to the treatment plan
    const treatmentPlanExercises = await Promise.all(
      selectedExercises.map((exercise, index) => {
        return TreatmentPlanExercise.create({
          treatmentPlanId: treatmentPlan.id,
          exerciseId: exercise.id,
          frequency: 'daily',
          sets: 3,
          reps: 10,
          duration: null,
          notes: 'AI-recommended exercise',
          order: index
        });
      })
    );
    
    return res.status(201).json({
      treatmentPlan,
      exercises: selectedExercises.map((exercise, index) => ({
        ...exercise.dataValues,
        sets: treatmentPlanExercises[index].sets,
        reps: treatmentPlanExercises[index].reps,
        frequency: treatmentPlanExercises[index].frequency,
        order: treatmentPlanExercises[index].order
      }))
    });
  } catch (error) {
    console.error('Generate exercise plan error:', error);
    return res.status(500).json({ message: 'Server error while generating exercise plan' });
  }
};

// Get AI-generated insights for a patient
const getPatientInsights = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if user is authorized
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'physiotherapist' && 
      req.user.id !== patientId
    ) {
      return res.status(403).json({ message: 'Not authorized to view patient insights' });
    }
    
    // Get patient's video analyses
    const analyses = await VideoAnalysis.find({ userId: patientId }).sort({ createdAt: -1 });
    
    if (!analyses.length) {
      return res.status(404).json({ message: 'No analyses found for this patient' });
    }
    
    // Calculate overall progress metrics
    const formScores = analyses.map(a => a.formScore);
    const movementQualityScores = analyses.map(a => a.movementQuality);
    const rangeOfMotionScores = analyses.map(a => a.rangeOfMotion);
    const symmetryScores = analyses.map(a => a.symmetry);
    
    const calculateProgress = (scores) => {
      if (scores.length < 2) return 0;
      const firstScore = scores[scores.length - 1]; // Oldest
      const lastScore = scores[0]; // Newest
      return ((lastScore - firstScore) / firstScore) * 100;
    };
    
    const insights = {
      overallProgress: {
        formProgress: calculateProgress(formScores),
        movementQualityProgress: calculateProgress(movementQualityScores),
        rangeOfMotionProgress: calculateProgress(rangeOfMotionScores),
        symmetryProgress: calculateProgress(symmetryScores)
      },
      currentScores: {
        formScore: formScores[0],
        movementQuality: movementQualityScores[0],
        rangeOfMotion: rangeOfMotionScores[0],
        symmetry: symmetryScores[0]
      },
      commonIssues: [],
      recommendations: []
    };
    
    // Identify common issues
    const issueTypes = {};
    analyses.forEach(analysis => {
      if (analysis.issues && analysis.issues.length > 0) {
        analysis.issues.forEach(issue => {
          if (!issueTypes[issue.type]) {
            issueTypes[issue.type] = 0;
          }
          issueTypes[issue.type]++;
        });
      }
    });
    
    // Sort issues by frequency
    const sortedIssues = Object.entries(issueTypes)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
    
    insights.commonIssues = sortedIssues;
    
    // Generate recommendations based on analyses
    if (analyses[0].recommendations && analyses[0].recommendations.length > 0) {
      insights.recommendations = analyses[0].recommendations;
    } else {
      insights.recommendations = [
        'Continue with your current exercise plan',
        'Focus on maintaining proper form during exercises',
        'Consider scheduling a follow-up appointment with your physiotherapist'
      ];
    }
    
    return res.status(200).json(insights);
  } catch (error) {
    console.error('Get patient insights error:', error);
    return res.status(500).json({ message: 'Server error while getting patient insights' });
  }
};

module.exports = {
  generateExercisePlan,
  getPatientInsights
};
