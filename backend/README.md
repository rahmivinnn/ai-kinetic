# AI Kinetic Backend

Backend server for the AI Kinetic physiotherapy platform.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (for structured data)
- MongoDB (for unstructured data)
- JWT Authentication
- Sequelize ORM
- Mongoose ODM

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- MongoDB

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root of the backend directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ai_kinetic
PG_USER=postgres
PG_PASSWORD=postgres

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/ai_kinetic

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=50000000 # 50MB
```

5. Create the PostgreSQL database:

```sql
CREATE DATABASE ai_kinetic;
```

6. Seed the database with initial data:

```bash
npm run seed
```

### Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password

### User Endpoints

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/physiotherapists` - Get all physiotherapists
- `GET /api/users/patients` - Get all patients (physiotherapists and admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/profile-image` - Update profile image
- `PUT /api/users/:id/deactivate` - Deactivate user

### Appointment Endpoints

- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments for current user
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Exercise Endpoints

- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/user` - Get exercises for current user
- `GET /api/exercises/category/:category` - Get exercises by category
- `GET /api/exercises/:id` - Get exercise by ID
- `POST /api/exercises` - Create a new exercise (physiotherapists only)
- `PUT /api/exercises/:id` - Update exercise (physiotherapists only)

### Treatment Plan Endpoints

- `POST /api/treatment-plans` - Create a new treatment plan (physiotherapists only)
- `GET /api/treatment-plans` - Get all treatment plans for current user
- `GET /api/treatment-plans/:id` - Get treatment plan by ID
- `PUT /api/treatment-plans/:id` - Update treatment plan (physiotherapists only)
- `PUT /api/treatment-plans/:id/status` - Update treatment plan status

### Video Endpoints

- `POST /api/videos/upload` - Upload a new video
- `GET /api/videos` - Get all videos for current user
- `GET /api/videos/library` - Get all library videos
- `GET /api/videos/:id` - Get video by ID
- `GET /api/videos/:id/analysis` - Get video analysis
- `POST /api/videos/:id/review` - Add therapist review to video

### AI Endpoints

- `POST /api/ai/exercise-plan/:patientId` - Generate exercise plan for patient
- `GET /api/ai/insights/:patientId` - Get patient insights

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Middleware functions
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── scripts/        # Utility scripts
│   ├── utils/          # Utility functions
│   └── app.js          # Main application file
├── uploads/            # Uploaded files
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## License

This project is licensed under the MIT License.
