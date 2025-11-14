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

// Tracks API Endpoints

// POST /api/tracks - Create a new track
app.post('/api/tracks', async (req, res) => {
  try {
    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    } = req.body;

    // Basic validation for required fields
    const missingFields = [];
    if (!songTitle) missingFields.push('songTitle');
    if (!artistName) missingFields.push('artistName');
    if (!albumName) missingFields.push('albumName');
    if (!genre) missingFields.push('genre');
    if (duration === undefined || duration === null) missingFields.push('duration');
    if (releaseYear === undefined || releaseYear === null) missingFields.push('releaseYear');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields
      });
    }

    if (typeof duration !== 'number' || typeof releaseYear !== 'number') {
      return res.status(400).json({
        error: 'duration and releaseYear must be numbers'
      });
    }

    const newTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    });

    return res.status(201).json(newTrack);
  } catch (error) {
    console.error("Error creating new track:", error);
    res.status(500).json({ error: "Failed to create track" });
  }
});

// PUT /api/tracks/:id - Update an existing track
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const trackId = req.params.id;

    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    } = req.body;

    const track = await Track.findByPk(trackId);

    if (!track) {
      return res.status(404).json({ error: `Track with id ${trackId} not found` });
    }

    const missingFields = [];
    if (!songTitle) missingFields.push('songTitle');
    if (!artistName) missingFields.push('artistName');
    if (!albumName) missingFields.push('albumName');
    if (!genre) missingFields.push('genre');
    if (duration === undefined || duration === null) missingFields.push('duration');
    if (releaseYear === undefined || releaseYear === null) missingFields.push('releaseYear');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields for update',
        missingFields
      });
    }

    if (typeof duration !== 'number' || typeof releaseYear !== 'number') {
      return res.status(400).json({
        error: 'duration and releaseYear must be numbers'
      });
    }

    // Apply update
    await track.update({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    });

    return res.status(200).json(track);
  } catch (error) {
    console.error("Error updating track:", error);
    res.status(500).json({ error: "Failed to update track" });
  }
});

// DELETE /api/tracks/:id - Delete a track by ID
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const trackId = req.params.id;

    const deletedCount = await Track.destroy({
      where: { trackId: trackId }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: `Track with id ${trackId} not found` });
    }

    return res.status(200).json({ message: `Track with id ${trackId} deleted successfully` });
  } catch (error) {
    console.error("Error deleting track:", error);
    res.status(500).json({ error: "Failed to delete track" });
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
