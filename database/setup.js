// database/setup.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Determine environment 
const env = process.env.NODE_ENV || 'development';

// Create Sequelize instance using environment variables
let sequelize;

if (env === 'production') {
  sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database/music_library_prod.db',
    logging: false
  });
} else {
  // Default: development
  sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database/music_library.db',
    logging: false
  });
}

// Define Track model
const Track = sequelize.define(
  'Track',
  {
    trackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    songTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'tracks',
    timestamps: false
  }
);

// Export for use in server.js and seed.js
module.exports = {
  sequelize,
  Track
};
