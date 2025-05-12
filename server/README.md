# Kinetic AI Server

Backend server for the Kinetic AI Physiotherapy Platform.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration values.

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/physiotherapists` - Get all physiotherapists
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Appointments

- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments for a user
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment

### Videos

- `POST /api/videos/upload` - Upload a new video
- `GET /api/videos` - Get all videos for a user
- `GET /api/videos/:id` - Get video by ID
- `GET /api/videos/:id/analysis` - Get video analysis
- `POST /api/videos/:id/review` - Add therapist review to video

### Exercises

- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/user` - Get exercises for a user's treatment plan
- `GET /api/exercises/category/:category` - Get exercises by category
- `GET /api/exercises/:id` - Get exercise by ID
- `POST /api/exercises` - Create a new exercise (admin or physiotherapist only)
- `PUT /api/exercises/:id` - Update exercise

### AI

- `POST /api/ai/exercise-plan/:patientId` - Generate an AI exercise plan for a patient
- `GET /api/ai/insights/:patientId` - Get AI-generated insights for a patient

## Database Models

### PostgreSQL

- User
- Appointment
- Exercise
- TreatmentPlan
- TreatmentPlanExercise
- Payment

### MongoDB

- Video
- VideoAnalysis
- Message
- Conversation
