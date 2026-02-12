const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// 1. POST: Create a new lead (This is what the website form will hit)
router.post('/add', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. GET: Fetch all leads (This is for your Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a lead (Status or Notes)
router.put('/:id', async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a lead by ID
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead successfully removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting" });
  }
});

module.exports = router;