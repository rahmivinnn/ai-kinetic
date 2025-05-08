import dotenv from 'dotenv';
import { initializeDatabase } from '../config/init-db.js';
import { logger } from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Run the database initialization
const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');
    await initializeDatabase();
    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

// Execute the seeding function
seedDatabase();
