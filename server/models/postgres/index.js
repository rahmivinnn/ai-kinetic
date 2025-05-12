const User = require('./user.model');
const Appointment = require('./appointment.model');
const Exercise = require('./exercise.model');
const TreatmentPlan = require('./treatment-plan.model');
const TreatmentPlanExercise = require('./treatment-plan-exercise.model');
const Payment = require('./payment.model');

// Define relationships
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });
User.hasMany(Appointment, { foreignKey: 'physiotherapistId', as: 'physiotherapistAppointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(User, { foreignKey: 'physiotherapistId', as: 'physiotherapist' });

User.hasMany(TreatmentPlan, { foreignKey: 'patientId', as: 'patientTreatmentPlans' });
User.hasMany(TreatmentPlan, { foreignKey: 'physiotherapistId', as: 'physiotherapistTreatmentPlans' });
TreatmentPlan.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
TreatmentPlan.belongsTo(User, { foreignKey: 'physiotherapistId', as: 'physiotherapist' });

TreatmentPlan.hasMany(TreatmentPlanExercise, { foreignKey: 'treatmentPlanId' });
TreatmentPlanExercise.belongsTo(TreatmentPlan, { foreignKey: 'treatmentPlanId' });

Exercise.hasMany(TreatmentPlanExercise, { foreignKey: 'exerciseId' });
TreatmentPlanExercise.belongsTo(Exercise, { foreignKey: 'exerciseId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Appointment,
  Exercise,
  TreatmentPlan,
  TreatmentPlanExercise,
  Payment
};
