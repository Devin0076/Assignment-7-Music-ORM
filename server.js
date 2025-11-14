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
// Tracks API Endpoints 

// GET /api/tracks - Returns all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.status(200).json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ error: "Failed to retrieve tracks" });
  }
});

// GET /api/tracks/:id - Returns track by ID
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const trackId = req.params.id;

    const track = await Track.findByPk(trackId);

    if (!track) {
      return res.status(404).json({ error: `Track with id ${trackId} not found` });
    }

    res.status(200).json(track);
  } catch (error) {
    console.error("Error fetching track by id:", error);
    res.status(500).json({ error: "Failed to retrieve track" });
  }
});



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
