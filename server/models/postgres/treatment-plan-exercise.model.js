const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/postgres');

const TreatmentPlanExercise = sequelize.define('TreatmentPlanExercise', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  treatmentPlanId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'TreatmentPlans',
      key: 'id'
    }
  },
  exerciseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Exercises',
      key: 'id'
    }
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'daily'
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds, if applicable'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = TreatmentPlanExercise;
