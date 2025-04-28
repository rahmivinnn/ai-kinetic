const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// In-memory storage for demo purposes
const users = [
  {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'patient@example.com',
    password: 'password',
    role: 'patient',
    createdAt: new Date()
  },
  {
    id: 'user2',
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    email: 'therapist@example.com',
    password: 'password',
    role: 'physiotherapist',
    createdAt: new Date()
  }
];

const tokens = {};

// Mock data for appointments
const appointments = [
  {
    id: 'appt1',
    patientId: 'user1',
    physiotherapistId: 'user2',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
    status: 'scheduled',
    type: 'video_call',
    notes: 'Initial assessment',
    meetingLink: 'https://meet.kinetic-ai.com/123456',
    patient: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'patient@example.com'
    },
    physiotherapist: {
      id: 'user2',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'therapist@example.com'
    }
  },
  {
    id: 'appt2',
    patientId: 'user1',
    physiotherapistId: 'user2',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
    status: 'scheduled',
    type: 'follow_up',
    notes: 'Follow-up session',
    meetingLink: 'https://meet.kinetic-ai.com/789012',
    patient: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'patient@example.com'
    },
    physiotherapist: {
      id: 'user2',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'therapist@example.com'
    }
  }
];

// Mock data for exercises
const exercises = [
  {
    id: 'ex1',
    name: 'Knee Extension',
    description: 'Strengthen quadriceps muscles',
    category: 'Knee',
    difficulty: 'beginner',
    targetArea: 'Quadriceps',
    instructions: 'Sit on a chair, extend your leg straight out, hold for 5 seconds, then lower.',
    demoVideoUrl: 'https://example.com/videos/knee-extension.mp4',
    thumbnailUrl: 'https://example.com/images/knee-extension.jpg',
    isActive: true
  },
  {
    id: 'ex2',
    name: 'Hamstring Stretch',
    description: 'Improve flexibility in hamstring muscles',
    category: 'Flexibility',
    difficulty: 'beginner',
    targetArea: 'Hamstrings',
    instructions: 'Sit on the floor with one leg extended, reach toward your toes.',
    demoVideoUrl: 'https://example.com/videos/hamstring-stretch.mp4',
    thumbnailUrl: 'https://example.com/images/hamstring-stretch.jpg',
    isActive: true
  },
  {
    id: 'ex3',
    name: 'Shoulder Rotation',
    description: 'Improve shoulder mobility',
    category: 'Shoulder',
    difficulty: 'intermediate',
    targetArea: 'Rotator Cuff',
    instructions: 'Hold a resistance band with both hands, rotate your arms outward.',
    demoVideoUrl: 'https://example.com/videos/shoulder-rotation.mp4',
    thumbnailUrl: 'https://example.com/images/shoulder-rotation.jpg',
    isActive: true
  },
  {
    id: 'ex4',
    name: 'Ankle Mobility',
    description: 'Improve ankle range of motion',
    category: 'Ankle',
    difficulty: 'beginner',
    targetArea: 'Ankle Joint',
    instructions: 'Sit on a chair, rotate your ankle in circles clockwise and counterclockwise.',
    demoVideoUrl: 'https://example.com/videos/ankle-mobility.mp4',
    thumbnailUrl: 'https://example.com/images/ankle-mobility.jpg',
    isActive: true
  },
  {
    id: 'ex5',
    name: 'Hip Abduction',
    description: 'Strengthen hip abductor muscles',
    category: 'Hip',
    difficulty: 'intermediate',
    targetArea: 'Hip Abductors',
    instructions: 'Lie on your side, lift your top leg upward, hold, then lower.',
    demoVideoUrl: 'https://example.com/videos/hip-abduction.mp4',
    thumbnailUrl: 'https://example.com/images/hip-abduction.jpg',
    isActive: true
  }
];

// Mock data for treatment plans
const treatmentPlans = [
  {
    id: 'tp1',
    patientId: 'user1',
    physiotherapistId: 'user2',
    title: 'Knee Rehabilitation Plan',
    description: 'A comprehensive plan to recover from knee injury',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active',
    goals: 'Improve knee mobility and strength',
    isAIGenerated: true
  }
];

// Mock data for treatment plan exercises
const treatmentPlanExercises = [
  {
    id: 'tpe1',
    treatmentPlanId: 'tp1',
    exerciseId: 'ex1',
    frequency: 'daily',
    sets: 3,
    reps: 10,
    notes: 'Focus on form',
    order: 0
  },
  {
    id: 'tpe2',
    treatmentPlanId: 'tp1',
    exerciseId: 'ex2',
    frequency: 'daily',
    sets: 2,
    reps: 15,
    notes: 'Hold each stretch for 30 seconds',
    order: 1
  },
  {
    id: 'tpe3',
    treatmentPlanId: 'tp1',
    exerciseId: 'ex4',
    frequency: 'daily',
    sets: 3,
    reps: 12,
    notes: 'Do this exercise after warming up',
    order: 2
  }
];

// Mock data for videos
const videos = [
  {
    _id: 'video1',
    userId: 'user1',
    title: 'Knee Extension Exercise - May 15',
    description: 'My first attempt at the knee extension exercise',
    exerciseId: 'ex1',
    fileUrl: '/uploads/knee-extension.mp4',
    thumbnailUrl: '/uploads/knee-extension-thumb.jpg',
    status: 'analyzed',
    aiAnalysisCompleted: true,
    therapistReviewed: true,
    reviewedBy: 'user2',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  }
];

// Mock data for video analyses
const videoAnalyses = [
  {
    _id: 'analysis1',
    videoId: 'video1',
    userId: 'user1',
    formScore: 75,
    movementQuality: 68,
    rangeOfMotion: 82,
    symmetry: 70,
    issues: [
      {
        type: 'alignment',
        description: 'Slight misalignment in knee position during extension',
        severity: 'low',
        timeMarkers: { start: 5, end: 10 }
      },
      {
        type: 'range',
        description: 'Not achieving full extension at the top of the movement',
        severity: 'medium',
        timeMarkers: { start: 15, end: 20 }
      }
    ],
    recommendations: [
      'Focus on keeping your knee aligned with your hip and ankle',
      'Try to achieve full extension at the top of the movement',
      'Maintain a steady pace throughout the exercise'
    ],
    aiNotes: 'Overall good form with minor adjustments needed for optimal results.',
    therapistNotes: 'Great progress! Work on extending fully at the top of the movement. Try to do this exercise daily.'
  }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kinetic AI API' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    console.log('Registration request:', { firstName, lastName, email, role });

    // Create new user (always succeed)
    const id = Math.random().toString(36).substring(2, 15);
    const newUser = {
      id,
      firstName: firstName || 'Guest',
      lastName: lastName || 'User',
      email: email || 'guest@example.com',
      password: password || 'password', // In a real app, this would be hashed
      role: role || 'patient',
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = Math.random().toString(36).substring(2, 15);
    tokens[token] = id;

    console.log('Registered user:', { ...newUser, password: '[HIDDEN]' });

    // Return user data and token
    return res.status(201).json({
      id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Even on error, return success with default data
    const id = Math.random().toString(36).substring(2, 15);
    const token = Math.random().toString(36).substring(2, 15);
    tokens[token] = id;

    return res.status(201).json({
      id,
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com',
      role: 'patient',
      token
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request:', { email });

    // Find user by email
    let user = users.find(user => user.email === email);

    // If user doesn't exist or password doesn't match, create a temporary user
    if (!user) {
      user = {
        id: Math.random().toString(36).substring(2, 15),
        firstName: 'Guest',
        lastName: 'User',
        email: email || 'guest@example.com',
        role: 'patient',
        createdAt: new Date()
      };

      users.push(user);
    }

    // Generate token
    const token = Math.random().toString(36).substring(2, 15);
    tokens[token] = user.id;

    console.log('Logged in user:', { ...user, password: '[HIDDEN]' });

    // Return user data and token (always succeed)
    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    // Even on error, return success with default data
    const id = Math.random().toString(36).substring(2, 15);
    const token = Math.random().toString(36).substring(2, 15);
    tokens[token] = id;

    return res.status(200).json({
      id,
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com',
      role: 'patient',
      token
    });
  }
});

app.get('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId;
    let user;

    // Try to get user from token
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      userId = tokens[token];

      if (userId) {
        user = users.find(user => user.id === userId);
      }
    }

    // If no valid user found, return a default user
    if (!user) {
      user = {
        id: 'default-user',
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@example.com',
        role: 'patient'
      };
    }

    // Always return a user profile (never fail)
    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    // Even on error, return a default user
    return res.status(200).json({
      id: 'default-user',
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com',
      role: 'patient'
    });
  }
});

// Authentication middleware - always succeeds
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let userId;
    let user;

    // Try to get user from token
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      userId = tokens[token];

      if (userId) {
        user = users.find(user => user.id === userId);
      }
    }

    // If no valid user found, use a default user
    if (!user) {
      user = {
        id: 'default-user',
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@example.com',
        role: 'patient',
        createdAt: new Date()
      };
    }

    // Always set a user and proceed
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Even on error, set a default user and proceed
    req.user = {
      id: 'default-user',
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com',
      role: 'patient',
      createdAt: new Date()
    };
    next();
  }
};

// Appointment routes
app.get('/api/appointments', verifyToken, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let userAppointments;

  if (userRole === 'patient') {
    userAppointments = appointments.filter(appt => appt.patientId === userId);
  } else if (userRole === 'physiotherapist') {
    userAppointments = appointments.filter(appt => appt.physiotherapistId === userId);
  } else {
    userAppointments = appointments; // Admin sees all
  }

  res.json(userAppointments);
});

app.post('/api/appointments', verifyToken, (req, res) => {
  try {
    const { physiotherapistId, startTime, endTime, type, notes } = req.body;
    const patientId = req.user.id;

    console.log('Create appointment request:', { physiotherapistId, startTime, type });

    // Check if physiotherapist exists
    const physiotherapist = users.find(user => user.id === physiotherapistId && user.role === 'physiotherapist');

    if (!physiotherapist) {
      return res.status(404).json({ message: 'Physiotherapist not found' });
    }

    // Create new appointment
    const newAppointment = {
      id: 'appt' + (appointments.length + 1),
      patientId,
      physiotherapistId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'scheduled',
      type,
      notes,
      meetingLink: type === 'video_call' ? `https://meet.kinetic-ai.com/${Date.now()}` : null,
      patient: {
        id: patientId,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      },
      physiotherapist: {
        id: physiotherapist.id,
        firstName: physiotherapist.firstName,
        lastName: physiotherapist.lastName,
        email: physiotherapist.email
      }
    };

    appointments.push(newAppointment);

    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    return res.status(500).json({ message: 'Server error while creating appointment' });
  }
});

app.get('/api/appointments/upcoming', verifyToken, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const now = new Date();

  let upcomingAppointments;

  if (userRole === 'patient') {
    upcomingAppointments = appointments.filter(
      appt => appt.patientId === userId && new Date(appt.startTime) > now && appt.status !== 'cancelled'
    );
  } else if (userRole === 'physiotherapist') {
    upcomingAppointments = appointments.filter(
      appt => appt.physiotherapistId === userId && new Date(appt.startTime) > now && appt.status !== 'cancelled'
    );
  }

  // Sort by start time (ascending)
  upcomingAppointments.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // Limit to 5
  upcomingAppointments = upcomingAppointments.slice(0, 5);

  res.json(upcomingAppointments);
});

app.get('/api/appointments/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const appointment = appointments.find(appt => appt.id === id);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Check if user is authorized to view this appointment
  if (
    userRole !== 'admin' &&
    appointment.patientId !== userId &&
    appointment.physiotherapistId !== userId
  ) {
    return res.status(403).json({ message: 'Not authorized to view this appointment' });
  }

  return res.status(200).json(appointment);
});

app.put('/api/appointments/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, status, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const appointment = appointments.find(appt => appt.id === id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to update this appointment
    if (
      userRole !== 'admin' &&
      appointment.patientId !== userId &&
      appointment.physiotherapistId !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Update appointment
    if (startTime) appointment.startTime = new Date(startTime);
    if (endTime) appointment.endTime = new Date(endTime);
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    return res.status(500).json({ message: 'Server error while updating appointment' });
  }
});

// Exercise routes
app.get('/api/exercises', verifyToken, (req, res) => {
  res.json(exercises);
});

app.get('/api/exercises/user', verifyToken, (req, res) => {
  const userId = req.user.id;

  // Get treatment plans for the user
  const userTreatmentPlans = treatmentPlans.filter(plan => plan.patientId === userId && plan.status === 'active');

  if (userTreatmentPlans.length === 0) {
    return res.json([]);
  }

  // Get treatment plan exercises
  const treatmentPlanIds = userTreatmentPlans.map(plan => plan.id);
  const userTreatmentPlanExercises = treatmentPlanExercises.filter(tpe => treatmentPlanIds.includes(tpe.treatmentPlanId));

  // Get exercise details and combine with treatment plan exercise data
  const userExercises = userTreatmentPlanExercises.map(tpe => {
    const exercise = exercises.find(ex => ex.id === tpe.exerciseId);
    return {
      ...exercise,
      sets: tpe.sets,
      reps: tpe.reps,
      frequency: tpe.frequency,
      notes: tpe.notes,
      treatmentPlanId: tpe.treatmentPlanId,
      order: tpe.order
    };
  });

  // Sort by order
  userExercises.sort((a, b) => a.order - b.order);

  res.json(userExercises);
});

// Video routes
app.get('/api/videos', verifyToken, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let userVideos;

  if (userRole === 'patient') {
    userVideos = videos.filter(video => video.userId === userId);
  } else if (userRole === 'physiotherapist') {
    userVideos = videos.filter(video => video.reviewedBy === userId || (video.status === 'analyzed' && !video.therapistReviewed));
  } else {
    userVideos = videos; // Admin sees all
  }

  res.json(userVideos);
});

app.post('/api/videos/upload', verifyToken, (req, res) => {
  try {
    const { title, description, exerciseId } = req.body;
    const userId = req.user.id;

    console.log('Video upload request:', { title, exerciseId });

    // Create a new video
    const newVideo = {
      _id: 'video' + (videos.length + 1),
      userId,
      title: title || 'Untitled Video',
      description: description || '',
      exerciseId,
      fileUrl: '/uploads/sample-video.mp4',
      thumbnailUrl: '/uploads/sample-thumbnail.jpg',
      status: 'uploaded',
      aiAnalysisCompleted: false,
      therapistReviewed: false,
      createdAt: new Date()
    };

    videos.push(newVideo);

    // Simulate AI analysis (after 2 seconds)
    setTimeout(() => {
      // Update video status
      newVideo.status = 'analyzed';
      newVideo.aiAnalysisCompleted = true;

      // Create analysis
      const newAnalysis = {
        _id: 'analysis' + (videoAnalyses.length + 1),
        videoId: newVideo._id,
        userId,
        formScore: Math.floor(Math.random() * 30) + 60, // 60-90
        movementQuality: Math.floor(Math.random() * 30) + 60,
        rangeOfMotion: Math.floor(Math.random() * 30) + 60,
        symmetry: Math.floor(Math.random() * 30) + 60,
        issues: [
          {
            type: 'alignment',
            description: 'Slight misalignment in position during exercise',
            severity: 'low',
            timeMarkers: { start: 5, end: 10 }
          }
        ],
        recommendations: [
          'Focus on maintaining proper form throughout the exercise',
          'Try to keep a steady pace during the movement',
          'Consider adding more repetitions as you progress'
        ],
        aiNotes: 'Overall good form with minor adjustments needed for optimal results.'
      };

      videoAnalyses.push(newAnalysis);

      console.log('AI analysis completed for video:', newVideo._id);
    }, 2000);

    return res.status(201).json(newVideo);
  } catch (error) {
    console.error('Video upload error:', error);
    return res.status(500).json({ message: 'Server error during video upload' });
  }
});

app.get('/api/videos/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const video = videos.find(v => v._id === id);

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  res.json(video);
});

app.get('/api/videos/:id/analysis', verifyToken, (req, res) => {
  const { id } = req.params;
  const analysis = videoAnalyses.find(a => a.videoId === id);

  if (!analysis) {
    return res.status(404).json({ message: 'Video analysis not found' });
  }

  res.json(analysis);
});

app.post('/api/videos/:id/review', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const therapistId = req.user.id;

    // Check if user is a physiotherapist
    if (req.user.role !== 'physiotherapist') {
      return res.status(403).json({ message: 'Only physiotherapists can review videos' });
    }

    const video = videos.find(v => v._id === id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update video status
    video.status = 'reviewed';
    video.therapistReviewed = true;
    video.reviewedBy = therapistId;

    // Update analysis with therapist notes
    const analysis = videoAnalyses.find(a => a.videoId === id);

    if (analysis) {
      analysis.therapistNotes = notes;
    }

    return res.status(200).json({
      message: 'Therapist review added successfully',
      video,
      analysis
    });
  } catch (error) {
    console.error('Add therapist review error:', error);
    return res.status(500).json({ message: 'Server error while adding therapist review' });
  }
});

// AI routes
app.get('/api/ai/insights/:patientId', verifyToken, (req, res) => {
  const { patientId } = req.params;

  // Get patient's video analyses
  const patientAnalyses = videoAnalyses.filter(analysis => analysis.userId === patientId);

  if (patientAnalyses.length === 0) {
    return res.status(404).json({ message: 'No analyses found for this patient' });
  }

  // Calculate overall progress metrics
  const formScores = patientAnalyses.map(a => a.formScore);
  const movementQualityScores = patientAnalyses.map(a => a.movementQuality);
  const rangeOfMotionScores = patientAnalyses.map(a => a.rangeOfMotion);
  const symmetryScores = patientAnalyses.map(a => a.symmetry);

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

  // Get recommendations from the latest analysis
  if (patientAnalyses[0].recommendations && patientAnalyses[0].recommendations.length > 0) {
    insights.recommendations = patientAnalyses[0].recommendations;
  }

  res.json(insights);
});

app.post('/api/ai/exercise-plan/:patientId', verifyToken, (req, res) => {
  try {
    const { patientId } = req.params;
    const physiotherapistId = req.user.id;

    // Check if user is a physiotherapist
    if (req.user.role !== 'physiotherapist' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only physiotherapists can generate exercise plans' });
    }

    // Check if patient exists
    const patient = users.find(user => user.id === patientId && user.role === 'patient');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a new treatment plan
    const newTreatmentPlan = {
      id: 'tp' + (treatmentPlans.length + 1),
      patientId,
      physiotherapistId,
      title: 'AI-Generated Exercise Plan',
      description: 'This exercise plan was automatically generated based on your movement patterns and progress.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      goals: 'Improve movement quality and address specific issues identified in your exercises.',
      isAIGenerated: true
    };

    treatmentPlans.push(newTreatmentPlan);

    // Select exercises for the plan
    const selectedExerciseIds = [];
    const difficultyLevels = ['beginner', 'intermediate', 'advanced'];

    // Select one exercise from each difficulty level
    difficultyLevels.forEach(difficulty => {
      const exercisesOfDifficulty = exercises.filter(e => e.difficulty === difficulty);
      if (exercisesOfDifficulty.length > 0) {
        const randomIndex = Math.floor(Math.random() * exercisesOfDifficulty.length);
        selectedExerciseIds.push(exercisesOfDifficulty[randomIndex].id);
      }
    });

    // Add exercises to the treatment plan
    const newTreatmentPlanExercises = [];

    selectedExerciseIds.forEach((exerciseId, index) => {
      const newTreatmentPlanExercise = {
        id: 'tpe' + (treatmentPlanExercises.length + index + 1),
        treatmentPlanId: newTreatmentPlan.id,
        exerciseId,
        frequency: 'daily',
        sets: 3,
        reps: 10,
        notes: 'AI-recommended exercise',
        order: index
      };

      treatmentPlanExercises.push(newTreatmentPlanExercise);
      newTreatmentPlanExercises.push(newTreatmentPlanExercise);
    });

    // Get full exercise details
    const selectedExercises = newTreatmentPlanExercises.map(tpe => {
      const exercise = exercises.find(ex => ex.id === tpe.exerciseId);
      return {
        ...exercise,
        sets: tpe.sets,
        reps: tpe.reps,
        frequency: tpe.frequency,
        order: tpe.order
      };
    });

    return res.status(201).json({
      treatmentPlan: newTreatmentPlan,
      exercises: selectedExercises
    });
  } catch (error) {
    console.error('Generate exercise plan error:', error);
    return res.status(500).json({ message: 'Server error while generating exercise plan' });
  }
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server is running on port ${PORT}`);
});
