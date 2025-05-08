import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Test JWT configuration
const testJwtConfig = () => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

  logger.info('Testing JWT configuration...');
  
  if (!jwtSecret) {
    logger.error('JWT_SECRET is not defined in .env file');
    return false;
  }
  
  if (!jwtExpiresIn) {
    logger.error('JWT_EXPIRES_IN is not defined in .env file');
    return false;
  }
  
  if (!jwtRefreshSecret) {
    logger.error('JWT_REFRESH_SECRET is not defined in .env file');
    return false;
  }
  
  if (!jwtRefreshExpiresIn) {
    logger.error('JWT_REFRESH_EXPIRES_IN is not defined in .env file');
    return false;
  }
  
  logger.info('JWT configuration is valid');
  return true;
};

// Test database configuration
const testDbConfig = () => {
  const pgHost = process.env.PG_HOST;
  const pgPort = process.env.PG_PORT;
  const pgDatabase = process.env.PG_DATABASE;
  const pgUser = process.env.PG_USER;
  const pgPassword = process.env.PG_PASSWORD;
  const mongoUri = process.env.MONGO_URI;

  logger.info('Testing database configuration...');
  
  if (!pgHost) {
    logger.error('PG_HOST is not defined in .env file');
    return false;
  }
  
  if (!pgPort) {
    logger.error('PG_PORT is not defined in .env file');
    return false;
  }
  
  if (!pgDatabase) {
    logger.error('PG_DATABASE is not defined in .env file');
    return false;
  }
  
  if (!pgUser) {
    logger.error('PG_USER is not defined in .env file');
    return false;
  }
  
  if (!pgPassword) {
    logger.error('PG_PASSWORD is not defined in .env file');
    return false;
  }
  
  if (!mongoUri) {
    logger.error('MONGO_URI is not defined in .env file');
    return false;
  }
  
  logger.info('Database configuration is valid');
  return true;
};

// Test file upload configuration
const testFileUploadConfig = () => {
  const uploadDir = process.env.UPLOAD_DIR;
  const maxFileSize = process.env.MAX_FILE_SIZE;

  logger.info('Testing file upload configuration...');
  
  if (!uploadDir) {
    logger.error('UPLOAD_DIR is not defined in .env file');
    return false;
  }
  
  if (!maxFileSize) {
    logger.error('MAX_FILE_SIZE is not defined in .env file');
    return false;
  }
  
  logger.info('File upload configuration is valid');
  return true;
};

// Run all tests
const runTests = () => {
  logger.info('Starting server configuration tests...');
  
  const jwtConfigValid = testJwtConfig();
  const dbConfigValid = testDbConfig();
  const fileUploadConfigValid = testFileUploadConfig();
  
  if (jwtConfigValid && dbConfigValid && fileUploadConfigValid) {
    logger.info('All configuration tests passed!');
    return true;
  } else {
    logger.error('Some configuration tests failed. Please check the logs.');
    return false;
  }
};

// Execute the tests
runTests();
