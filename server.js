// server.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize, Track } = require('./database/setup');

const app = express();
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Music Library API is running' });
});


app.set('models', { Track });


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database!");

    // Do NOT sync or drop tables here 
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();


module.exports = app;
