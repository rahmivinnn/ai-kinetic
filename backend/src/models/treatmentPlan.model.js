import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.model.js';
import Exercise from './exercise.model.js';

const TreatmentPlan = sequelize.define('TreatmentPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  physiotherapistId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Define associations
TreatmentPlan.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
TreatmentPlan.belongsTo(User, { as: 'physiotherapist', foreignKey: 'physiotherapistId' });

// Junction table for many-to-many relationship between TreatmentPlan and Exercise
const TreatmentPlanExercise = sequelize.define('TreatmentPlanExercise', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  treatmentPlanId: {
    type: DataTypes.UUID,
    references: {
      model: TreatmentPlan,
      key: 'id'
    }
  },
  exerciseId: {
    type: DataTypes.UUID,
    references: {
      model: Exercise,
      key: 'id'
    }
  },
  customSets: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  customReps: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  customDuration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  customNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

// Set up many-to-many relationship
TreatmentPlan.belongsToMany(Exercise, { through: TreatmentPlanExercise });
Exercise.belongsToMany(TreatmentPlan, { through: TreatmentPlanExercise });

export { TreatmentPlan, TreatmentPlanExercise };
