import User from './user.model.js';
import Appointment from './appointment.model.js';
import Exercise from './exercise.model.js';
import { TreatmentPlan, TreatmentPlanExercise } from './treatmentPlan.model.js';
import Video from './video.model.js';
import VideoAnalysis from './videoAnalysis.model.js';
import PatientProgress from './patientProgress.model.js';

// Set up associations
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'physiotherapistAppointments', foreignKey: 'physiotherapistId' });

User.hasMany(TreatmentPlan, { as: 'patientTreatmentPlans', foreignKey: 'patientId' });
User.hasMany(TreatmentPlan, { as: 'physiotherapistTreatmentPlans', foreignKey: 'physiotherapistId' });

export {
  User,
  Appointment,
  Exercise,
  TreatmentPlan,
  TreatmentPlanExercise,
  Video,
  VideoAnalysis,
  PatientProgress
};
