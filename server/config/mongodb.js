const mongoose = require('mongoose');

// MongoDB connection
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/kinetic_ai';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to MongoDB database:', error);
    throw error;
  }
};

module.exports = {
  connectMongoDB
};
