const express = require('express');
const fs = require('fs').promises; 
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

let cachedStats = null;
let lastModified = 0;

async function calculateStats() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const items = JSON.parse(raw);
  return {
    total: items.length,
    averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
  };
}

async function getFileModifiedTime() {
  const stats = await fs.stat(DATA_PATH);
  return stats.mtimeMs;
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const mtime = await getFileModifiedTime();

    if (!cachedStats || mtime > lastModified) {
      cachedStats = await calculateStats();
      lastModified = mtime;
    }

    res.json(cachedStats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;