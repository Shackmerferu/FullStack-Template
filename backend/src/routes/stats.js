const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Path to the items data file
const DATA_PATH = path.join(__dirname, '../../data/items.json');

// Cache storage for computed statistics
let cachedStats = null;
// Timestamp of last data file modification
let lastModified = 0;

// Calculates statistics from the items data
// Computes total count and average price
async function calculateStats() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8'); // Read file contents
  const items = JSON.parse(raw); // Parse JSON data
  return {
    total: items.length, // Total number of items
    averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length, // Calculate average price
  };
}

// Retrieves the last modification time of the data file
// Used to determine if cache needs refreshing
async function getFileModifiedTime() {
  const stats = await fs.stat(DATA_PATH);
  return stats.mtimeMs;
}

// Route: GET /api/stats
// Returns cached statistics about items
// Automatically refreshes cache if data file has changed
router.get('/', async (req, res, next) => {
  try {
    const mtime = await getFileModifiedTime(); // Check current file mod time

    if (!cachedStats || mtime > lastModified) { // If no cache or file updated
      cachedStats = await calculateStats(); // Recalculate stats
      lastModified = mtime; // Update lastModified timestamp
    }

    res.json(cachedStats); // Return cached stats
  } catch (err) {
    next(err); // Forward error to middleware
  }
});

module.exports = router;
