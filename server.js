// server.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Simple root route just to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'Music Library API is running' });
});

// In later commits we’ll add /api/tracks routes here

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
