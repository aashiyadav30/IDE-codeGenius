
const express = require('express');
const File = require('../models/File');

const router = express.Router();


router.post('/', async (req, res) => {
  const { name, content } = req.body;

  try {
    const newFile = new File({ name, content });
    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create file' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});


router.put('/:id', async (req, res) => {
  const { content } = req.body;

  try {
    const updated = await File.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update file' });
  }
});


router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = router;
