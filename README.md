# Kinetic AI - Physiotherapy SaaS Platform

Kinetic AI is an AI-powered physiotherapy platform that helps patients recover faster with personalized exercise plans, AI-based movement analysis, and remote physiotherapist guidance.

## Features

- **User Authentication**: Secure login and registration for patients and physiotherapists
- **Patient Dashboard**: Track progress, view exercise plans, and upload exercise videos
- **AI Movement Analysis**: Get instant feedback on exercise form using pose estimation
- **Personalized Exercise Plans**: AI-generated exercise plans based on patient progress
- **Video Upload & Review**: Upload exercise videos for AI analysis and therapist feedback
- **Appointment Management**: Schedule and manage video appointments with physiotherapists
- **Secure Messaging**: Communicate with your physiotherapist through secure messaging
- **Payment Integration**: Process payments securely through Stripe

## Tech Stack

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TensorFlow.js for client-side pose estimation

### Backend
- Node.js with Express
- PostgreSQL for structured data (users, appointments, etc.)
- MongoDB for unstructured data (videos, analysis results)
- JWT authentication
- MediaPipe/TensorFlow for AI analysis

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/kinetic-ai.git
   cd kinetic-ai
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd server
   npm install
   ```

4. Create environment variables:
   - Copy `.env.example` to `.env.local` in the root directory
   - Copy `server/.env.example` to `server/.env`
   - Update the environment variables with your configuration

5. Start the development servers:

   Frontend:
   ```
   npm run dev
   ```

   Backend:
   ```
   cd server
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Deploying to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Login to Vercel:
   ```
   vercel login
   ```
4. Deploy the project:
   ```
   vercel
   ```
5. For production deployment:
   ```
   vercel --prod
   ```

The application is currently deployed at: [https://ai-kinetic.vercel.app](https://ai-kinetic.vercel.app)

## Project Structure

```
kinetic-ai/
├── public/              # Static assets
├── server/              # Backend server
│   ├── config/          # Database and server configuration
│   ├── controllers/     # API controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   │   ├── postgres/    # PostgreSQL models
│   │   └── mongodb/     # MongoDB models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── src/                 # Frontend source code
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utility functions and API clients
│   └── styles/          # Global styles
└── README.md            # Project documentation
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [TensorFlow.js](https://www.tensorflow.org/js)
- [MediaPipe](https://mediapipe.dev/)
- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [shadcn/ui](https://ui.shadcn.com/)
