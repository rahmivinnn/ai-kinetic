import mongoose from 'mongoose';

const patientProgressSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    ref: 'User'
  },
  treatmentPlanId: {
    type: String,
    ref: 'TreatmentPlan'
  },
  date: {
    type: Date,
    default: Date.now
  },
  metrics: {
    painLevel: {
      type: Number,
      min: 0,
      max: 10
    },
    mobility: {
      type: Number,
      min: 0,
      max: 100
    },
    strength: {
      type: Number,
      min: 0,
      max: 100
    },
    balance: {
      type: Number,
      min: 0,
      max: 100
    },
    overall: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  completedExercises: [{
    exerciseId: {
      type: String,
      ref: 'Exercise'
    },
    sets: Number,
    reps: Number,
    duration: Number,
    notes: String,
    difficulty: {
      type: Number,
      min: 1,
      max: 10
    },
    painDuring: {
      type: Number,
      min: 0,
      max: 10
    },
    painAfter: {
      type: Number,
      min: 0,
      max: 10
    }
  }],
  notes: {
    type: String
  },
  patientFeedback: {
    type: String
  },
  therapistNotes: {
    type: String
  }
}, {
  timestamps: true
});

const PatientProgress = mongoose.model('PatientProgress', patientProgressSchema);

export default PatientProgress;
