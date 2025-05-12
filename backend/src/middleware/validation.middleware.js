import { validationResult, body, param } from 'express-validator';

// Middleware to handle validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// User validation rules
export const userValidationRules = {
  register: [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body('role')
      .optional()
      .isIn(['patient', 'physiotherapist', 'admin'])
      .withMessage('Invalid role')
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  update: [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body('role')
      .optional()
      .isIn(['patient', 'physiotherapist', 'admin'])
      .withMessage('Invalid role'),
    body('dateOfBirth').optional().isDate().withMessage('Invalid date of birth'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Invalid gender'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number')
  ]
};

// Appointment validation rules
export const appointmentValidationRules = {
  create: [
    body('startTime').isISO8601().withMessage('Invalid start time'),
    body('endTime').isISO8601().withMessage('Invalid end time'),
    body('type')
      .isIn(['video', 'in-person'])
      .withMessage('Type must be either video or in-person'),
    body('physiotherapistId').notEmpty().withMessage('Physiotherapist ID is required'),
    body('notes').optional()
  ],
  update: [
    body('startTime').optional().isISO8601().withMessage('Invalid start time'),
    body('endTime').optional().isISO8601().withMessage('Invalid end time'),
    body('status')
      .optional()
      .isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
      .withMessage('Invalid status'),
    body('type')
      .optional()
      .isIn(['video', 'in-person'])
      .withMessage('Type must be either video or in-person'),
    body('notes').optional(),
    body('meetingLink').optional().isURL().withMessage('Invalid meeting link'),
    body('cancellationReason').optional()
  ]
};

// Exercise validation rules
export const exerciseValidationRules = {
  create: [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('difficulty')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level'),
    body('targetArea').notEmpty().withMessage('Target area is required'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    body('sets').isInt({ min: 1 }).withMessage('Sets must be a positive integer'),
    body('reps').isInt({ min: 1 }).withMessage('Reps must be a positive integer'),
    body('frequency').notEmpty().withMessage('Frequency is required'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('notes').optional()
  ],
  update: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level'),
    body('targetArea').optional().notEmpty().withMessage('Target area cannot be empty'),
    body('instructions').optional().notEmpty().withMessage('Instructions cannot be empty'),
    body('sets').optional().isInt({ min: 1 }).withMessage('Sets must be a positive integer'),
    body('reps').optional().isInt({ min: 1 }).withMessage('Reps must be a positive integer'),
    body('frequency').optional().notEmpty().withMessage('Frequency cannot be empty'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('notes').optional()
  ]
};

// Treatment plan validation rules
export const treatmentPlanValidationRules = {
  create: [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date'),
    body('patientId').notEmpty().withMessage('Patient ID is required'),
    body('notes').optional()
  ],
  update: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional(),
    body('startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date'),
    body('status')
      .optional()
      .isIn(['active', 'completed', 'paused'])
      .withMessage('Invalid status'),
    body('notes').optional()
  ]
};

// Video validation rules
export const videoValidationRules = {
  upload: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('exerciseId').optional()
  ],
  review: [
    body('content').notEmpty().withMessage('Review content is required')
  ]
};
