const express = require('express');
const fs = require('fs').promises; // Async file operations
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json'); // Path to items data

let cachedStats = null; // Cache for computed stats
let lastModified = 0; // Timestamp of last file modification

async function calculateStats() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8'); // Read file contents
  const items = JSON.parse(raw); // Parse JSON data
  return {
    total: items.length, // Total number of items
    averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length, // Calculate average price
  };
}

async function getFileModifiedTime() {
  const stats = await fs.stat(DATA_PATH); // Get file stats metadata
  return stats.mtimeMs; // Return modification time in milliseconds
}

// GET /api/stats - serve cached stats, refresh if file updated
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
