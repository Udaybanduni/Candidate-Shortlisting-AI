const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Add a new candidate
router.post('/', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    const savedCandidate = await candidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
