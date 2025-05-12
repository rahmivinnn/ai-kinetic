import { sequelize } from './db.js';
import { User, Appointment, Exercise, TreatmentPlan, TreatmentPlanExercise } from '../models/index.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcrypt';

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    logger.info('Database synchronized');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@aikinetic.com',
      password: adminPassword,
      role: 'admin'
    });
    logger.info(`Admin user created: ${admin.email}`);
    
    // Create sample physiotherapists
    const physio1Password = await bcrypt.hash('physio123', 10);
    const physio1 = await User.create({
      firstName: 'John',
      lastName: 'Johnson',
      email: 'dr.johnson@aikinetic.com',
      password: physio1Password,
      role: 'physiotherapist',
      specialization: 'Orthopedic Rehabilitation',
      experience: '15 years',
      bio: 'Specialized in knee and hip rehabilitation with a focus on sports injuries.',
      availability: ['Monday', 'Wednesday', 'Friday'],
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop'
    });
    logger.info(`Physiotherapist created: ${physio1.email}`);
    
    const physio2Password = await bcrypt.hash('physio123', 10);
    const physio2 = await User.create({
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'dr.smith@aikinetic.com',
      password: physio2Password,
      role: 'physiotherapist',
      specialization: 'Sports Rehabilitation',
      experience: '8 years',
      bio: 'Former athlete specializing in sports-related injuries and performance optimization.',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'
    });
    logger.info(`Physiotherapist created: ${physio2.email}`);
    
    // Create sample patients
    const patient1Password = await bcrypt.hash('patient123', 10);
    const patient1 = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: patient1Password,
      role: 'patient',
      dateOfBirth: '1990-05-15',
      gender: 'female',
      medicalHistory: 'ACL reconstruction surgery 3 months ago',
      emergencyContact: 'John Doe, 555-123-4567'
    });
    logger.info(`Patient created: ${patient1.email}`);
    
    const patient2Password = await bcrypt.hash('patient123', 10);
    const patient2 = await User.create({
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      password: patient2Password,
      role: 'patient',
      dateOfBirth: '1985-10-20',
      gender: 'male',
      medicalHistory: 'Rotator cuff injury, chronic lower back pain',
      emergencyContact: 'Lisa Brown, 555-987-6543'
    });
    logger.info(`Patient created: ${patient2.email}`);
    
    // Create sample exercises
    const exercise1 = await Exercise.create({
      name: 'Knee Extension',
      description: 'Strengthen quadriceps muscles',
      category: 'strength',
      difficulty: 'beginner',
      targetArea: 'knee',
      instructions: 'Sit on a chair with your back straight. Slowly extend your right leg until it\'s parallel to the floor. Hold for 5 seconds, then slowly lower it back down. Repeat with the left leg.',
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      sets: 3,
      reps: 10,
      frequency: 'Daily',
      duration: 5,
      notes: 'Focus on controlled movements'
    });
    logger.info(`Exercise created: ${exercise1.name}`);
    
    const exercise2 = await Exercise.create({
      name: 'Hamstring Curl',
      description: 'Strengthen hamstring muscles',
      category: 'strength',
      difficulty: 'intermediate',
      targetArea: 'knee',
      instructions: 'Lie face down on a mat. Slowly bend your right knee, bringing your heel toward your buttocks. Hold for 3 seconds, then slowly lower it back down. Repeat with the left leg.',
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop',
      sets: 3,
      reps: 8,
      frequency: 'Daily',
      duration: 3,
      notes: 'Avoid arching your back'
    });
    logger.info(`Exercise created: ${exercise2.name}`);
    
    const exercise3 = await Exercise.create({
      name: 'Balance Training',
      description: 'Improve stability and proprioception',
      category: 'balance',
      difficulty: 'beginner',
      targetArea: 'full body',
      instructions: 'Stand on one leg with your knee slightly bent. Try to maintain your balance for 30 seconds. Switch to the other leg and repeat.',
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop',
      sets: 2,
      reps: 5,
      frequency: 'Daily',
      duration: 30,
      notes: 'Use a wall or chair for support if needed'
    });
    logger.info(`Exercise created: ${exercise3.name}`);
    
    // Create sample treatment plans
    const treatmentPlan1 = await TreatmentPlan.create({
      name: 'ACL Rehabilitation Plan',
      description: 'Post-surgery rehabilitation plan for ACL reconstruction',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7776000000), // 90 days from now
      status: 'active',
      notes: 'Focus on regaining range of motion and strengthening quadriceps',
      patientId: patient1.id,
      physiotherapistId: physio1.id
    });
    logger.info(`Treatment plan created: ${treatmentPlan1.name}`);
    
    // Add exercises to treatment plan
    await TreatmentPlanExercise.create({
      treatmentPlanId: treatmentPlan1.id,
      exerciseId: exercise1.id,
      customSets: 3,
      customReps: 12,
      order: 1
    });
    
    await TreatmentPlanExercise.create({
      treatmentPlanId: treatmentPlan1.id,
      exerciseId: exercise2.id,
      customSets: 3,
      customReps: 10,
      order: 2
    });
    
    await TreatmentPlanExercise.create({
      treatmentPlanId: treatmentPlan1.id,
      exerciseId: exercise3.id,
      customSets: 2,
      customReps: 5,
      customDuration: 30,
      order: 3
    });
    
    logger.info('Sample data created successfully');
    
    return {
      admin,
      physiotherapists: [physio1, physio2],
      patients: [patient1, patient2],
      exercises: [exercise1, exercise2, exercise3],
      treatmentPlans: [treatmentPlan1]
    };
  } catch (error) {
    logger.error(`Database initialization error: ${error.message}`);
    throw error;
  }
};
