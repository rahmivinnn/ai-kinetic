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
    
    // Get patient's video analyses to inform the exercise plan with detailed metrics
    const analyses = await VideoAnalysis.find({ userId: patientId }).sort({ createdAt: -1 }).limit(5);
    
    // Get all available exercises with their metadata
    const allExercises = await Exercise.findAll({
      where: { isActive: true }
    });
    
    const selectedExercises = [];
    const exerciseScores = new Map();
    
    // Calculate patient's progress metrics
    const progressMetrics = {
      formProgress: 0,
      stabilityProgress: 0,
      rangeProgress: 0,
      consistencyScore: 0
    };
    
    if (analyses.length >= 2) {
      const firstAnalysis = analyses[analyses.length - 1];
      const latestAnalysis = analyses[0];
      
      progressMetrics.formProgress = ((latestAnalysis.formScore || 0) - (firstAnalysis.formScore || 0));
      progressMetrics.stabilityProgress = ((latestAnalysis.stability || 0) - (firstAnalysis.stability || 0));
      progressMetrics.rangeProgress = ((latestAnalysis.rangeOfMotion || 0) - (firstAnalysis.rangeOfMotion || 0));
      
      // Calculate consistency across sessions
      const scores = analyses.map(a => a.formScore || 0);
      const avgDiff = scores.slice(1).reduce((acc, score, i) => acc + Math.abs(score - scores[i]), 0) / (scores.length - 1);
      progressMetrics.consistencyScore = Math.max(0, 100 - avgDiff);

    if (analyses.length > 0) {
      const latestAnalysis = analyses[0];
      
      // Enhanced metrics analysis for more accurate difficulty assessment
      const formScore = latestAnalysis.realTimeMetrics?.formScore || 0;
      const movementQuality = latestAnalysis.realTimeMetrics?.movementQuality || 0;
      const stability = latestAnalysis.realTimeMetrics?.stability || 0;
      const rangeOfMotion = latestAnalysis.realTimeMetrics?.rangeOfMotion || 0;
      const symmetry = latestAnalysis.realTimeMetrics?.symmetry || 0;
      
      // Calculate weighted overall score based on multiple factors
      const weights = {
        form: 0.3,
        movement: 0.2,
        stability: 0.2,
        range: 0.15,
        symmetry: 0.15
      };
      
      const overallScore = (
        formScore * weights.form +
        movementQuality * weights.movement +
        stability * weights.stability +
        rangeOfMotion * weights.range +
        symmetry * weights.symmetry
      );
      
      // Dynamic difficulty adjustment based on progress metrics
      let difficultyLevel = 'beginner';
      if (overallScore >= 80 && progressMetrics.consistencyScore >= 70) {
        difficultyLevel = 'advanced';
      } else if (overallScore >= 60 || (progressMetrics.formProgress > 10 && progressMetrics.consistencyScore >= 60)) {
        difficultyLevel = 'intermediate';
      }
      
      // Enhanced exercise scoring system with personalized analysis
      allExercises.forEach(exercise => {
        let score = 0;
        let matchStrength = 0;
        
        // Intelligent difficulty matching with progression consideration
        if (exercise.difficulty === difficultyLevel) {
          score += 30;
          if (progressMetrics.consistencyScore >= 75) score += 10;
        } else if (progressMetrics.formProgress > 15 && exercise.difficulty === 'intermediate') {
          score += 20; // Encourage progression when ready
        }
        
        // Comprehensive issue analysis and targeted exercise matching
        if (latestAnalysis.issues?.length > 0) {
          latestAnalysis.issues.forEach(issue => {
            const severityMultiplier = issue.severity === 'high' ? 1.5 :
                                      issue.severity === 'medium' ? 1 : 0.5;
            
            // Advanced alignment matching
            if (issue.type === 'alignment') {
              const alignmentMatch = exercise.targetArea.toLowerCase().includes('alignment') ||
                                    exercise.description.toLowerCase().includes('posture');
              if (alignmentMatch) {
                score += 25 * severityMultiplier;
                matchStrength++;
                
                // Bonus for specific alignment targeting
                if (exercise.description.toLowerCase().includes(issue.details?.area || '')) {
                  score += 15;
                  matchStrength++;
                }
              }
            }
            
            // Advanced range of motion matching
            if (issue.type === 'range') {
              const romMatch = exercise.targetArea.toLowerCase().includes('flexibility') ||
                              exercise.description.toLowerCase().includes('range of motion');
              if (romMatch) {
                score += 25 * severityMultiplier;
                matchStrength++;
                
                // Additional points for mobility focus
                if (progressMetrics.rangeProgress < 0 && 
                    exercise.description.toLowerCase().includes('mobility')) {
                  score += 15;
                  matchStrength++;
                }
              }
            }
            
            // Advanced stability matching
            if (issue.type === 'stability') {
              const stabilityMatch = exercise.targetArea.toLowerCase().includes('balance') ||
                                    exercise.description.toLowerCase().includes('stability');
              if (stabilityMatch) {
                score += 25 * severityMultiplier;
                matchStrength++;
                
                // Bonus for core stability focus
                if (progressMetrics.stabilityProgress < 0 && 
                    exercise.description.toLowerCase().includes('core')) {
                  score += 15;
                  matchStrength++;
                }
              }
            }
          });
        }
        
        // Advanced movement quality analysis and personalized recommendations
        if (latestAnalysis.realTimeMetrics) {
          // Dynamic range of motion adaptation
          if (latestAnalysis.realTimeMetrics.rangeOfMotion < 70) {
            if (exercise.description.toLowerCase().includes('stretch')) {
              score += 15;
              matchStrength++;
              // Progressive mobility work
              if (progressMetrics.rangeProgress > 5) {
                score += 10; // Reward progress with more challenging exercises
              }
            }
          }

          // Enhanced stability training
          if (latestAnalysis.realTimeMetrics.stability < 70) {
            if (exercise.description.toLowerCase().includes('balance')) {
              score += 15;
              matchStrength++;
              // Add core-focused exercises for better stability
              if (exercise.description.toLowerCase().includes('core')) {
                score += 10;
                matchStrength++;
              }
            }
          }

          // Symmetry and coordination improvement
          if (latestAnalysis.realTimeMetrics.symmetry < 70) {
            if (exercise.description.toLowerCase().includes('bilateral')) {
              score += 15;
              matchStrength++;
              // Focus on coordination for better symmetry
              if (exercise.description.toLowerCase().includes('coordination')) {
                score += 10;
                matchStrength++;
              }
            }
          }

          // Adjust score based on exercise complexity and patient readiness
          score *= (1 + (matchStrength * 0.1)); // Boost exercises that match multiple criteria
        }
        
        exerciseScores.set(exercise, score);
      });
      
      // Select top scoring exercises
      const sortedExercises = Array.from(exerciseScores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      selectedExercises.push(...sortedExercises.slice(0, 6));
    } else {
      // No analyses available, select balanced default exercises
      const beginnerExercises = allExercises.filter(e => e.difficulty === 'beginner').slice(0, 2);
      const intermediateExercises = allExercises.filter(e => e.difficulty === 'intermediate').slice(0, 2);
      const advancedExercises = allExercises.filter(e => e.difficulty === 'advanced').slice(0, 2);
      
      selectedExercises.push(...beginnerExercises, ...intermediateExercises, ...advancedExercises);
    }
    
    // Ensure we have at least 5 exercises
    if (selectedExercises.length < 5) {
      const remainingCount = 5 - selectedExercises.length;
      const selectedIds = selectedExercises.map(e => e.id);
      const remainingExercises = allExercises.filter(e => !selectedIds.includes(e.id));
      selectedExercises.push(...remainingExercises.slice(0, remainingCount));
    }
    
    // Advanced intensity and frequency calculation based on comprehensive metrics
    let intensity = 'moderate';
    let frequency = 'daily';
    let sets = 3;
    let reps = 10;

    if (analyses.length > 0) {
      const latestAnalysis = analyses[0];
      
      // Calculate weighted performance score
      const performanceScore = (
        (latestAnalysis.realTimeMetrics?.formScore || 0) * 0.4 +
        (latestAnalysis.realTimeMetrics?.movementQuality || 0) * 0.3 +
        (latestAnalysis.realTimeMetrics?.stability || 0) * 0.3
      );
      
      // Dynamic intensity adjustment based on multiple factors
      if (performanceScore < 180 || progressMetrics.formProgress < -5) {
        intensity = 'light';
        sets = 2;
        reps = 8;
      } else if (performanceScore > 240 && progressMetrics.consistencyScore > 70) {
        intensity = 'challenging';
        sets = 4;
        reps = 12;
      }

      // Adaptive frequency based on progress and consistency
      if (analyses.length >= 3) {
        const progressTrend = analyses.slice(0, 3).every((analysis, index) => {
          if (index === 2) return true;
          const currentMetrics = analysis.realTimeMetrics || {};
          const nextMetrics = analyses[index + 1].realTimeMetrics || {};
          
          return (
            (currentMetrics.formScore || 0) >= (nextMetrics.formScore || 0) &&
            (currentMetrics.stability || 0) >= (nextMetrics.stability || 0) &&
            (currentMetrics.movementQuality || 0) >= (nextMetrics.movementQuality || 0)
          );
        });

        if (progressTrend && progressMetrics.consistencyScore > 80) {
          frequency = 'twice_daily';
          // Adjust sets for split sessions
          sets = Math.max(2, sets - 1);
        }
      }
    }

    // Create a new treatment plan
    // Analyze progress from previous treatment plans
    const previousPlans = await TreatmentPlan.findAll({
      where: { patientId, status: 'completed' },
      order: [['createdAt', 'DESC']],
      limit: 1
    });

    let planTitle = 'AI-Generated Exercise Plan';
    let planDescription = 'Personalized exercise plan based on your movement analysis';

    if (previousPlans.length > 0) {
      const lastPlan = previousPlans[0];
      planTitle += ' - Progressive Phase';
      planDescription += ' and previous progress';
    }

    const treatmentPlan = await TreatmentPlan.create({
      patientId,
      physiotherapistId,
      title: planTitle,
      description: planDescription,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      goals: `Improve overall movement quality and address specific issues with ${intensity} intensity training`,
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
