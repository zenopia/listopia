const express = require('express');
const router = express.Router();
const List = require('../models/List');

// Create a new list
router.post('/', async (req, res) => {
  try {
    const newList = new List(req.body);
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//app.use('/api/lists', require('./routes/lists'));

// Get all lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific list
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a list
router.patch('/:id', async (req, res) => {
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedList) return res.status(404).json({ message: 'List not found' });
    res.json(updatedList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a list
router.delete('/:id', async (req, res) => {
  try {
    const deletedList = await List.findByIdAndDelete(req.params.id);
    if (!deletedList) return res.status(404).json({ message: 'List not found' });
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;