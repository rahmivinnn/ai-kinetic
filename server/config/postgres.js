const { Sequelize } = require('sequelize');

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'kinetic_ai',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'password',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
    
    // Sync all models
    // Note: In production, you should use migrations instead of sync
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to PostgreSQL database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectPostgres
};
