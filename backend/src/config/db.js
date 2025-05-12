import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'ai_kinetic',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD || 'postgres',
  {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// MongoDB connection
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_kinetic';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to both databases
export const connectDB = async () => {
  try {
    // Test PostgreSQL connection
    await sequelize.authenticate();
    logger.info('PostgreSQL connected');

    // Set global variable for sequelize connection
    global.sequelize = sequelize;

    // Connect to MongoDB
    await connectMongoDB();

    return { sequelize, mongoose };
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);

    // In development mode, we'll continue without exiting
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Continuing in development mode without database connection...');
      global.sequelize = null;
      return { sequelize: null, mongoose: null };
    }

    // In production mode, we'll exit
    process.exit(1);
  }
};

export { sequelize, mongoose };
