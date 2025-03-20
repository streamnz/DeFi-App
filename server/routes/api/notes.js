const express = require('express');
const router = express.Router();

// In-memory storage for notes
let notesData = [];
let nextId = 1;

// Middleware to log requests
router.use((req, res, next) => {
  console.log(
    `[Notes API] ${req.method} ${req.url} at ${new Date().toISOString()}`
  );
  next();
});

/**
 * @route   GET /api/notes
 * @desc    Get all notes
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    console.log('Fetching all notes');
    res.json(notesData);
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/notes/:id
 * @desc    Get note by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const note = notesData.find((note) => note.id === parseInt(req.params.id));
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Public
 */
router.post('/', (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: 'Title and content are required' });
    }

    const newNote = {
      id: nextId++,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notesData.push(newNote);
    console.log('Created new note:', newNote);
    res.json(newNote);
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 * @access  Public
 */
router.put('/:id', (req, res) => {
  try {
    const { title, content } = req.body;
    const noteIndex = notesData.findIndex(
      (note) => note.id === parseInt(req.params.id)
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update only provided fields
    if (title) notesData[noteIndex].title = title;
    if (content) notesData[noteIndex].content = content;
    notesData[noteIndex].updatedAt = new Date().toISOString();

    console.log('Updated note:', notesData[noteIndex]);
    res.json(notesData[noteIndex]);
  } catch (err) {
    console.error('Error updating note:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  try {
    const noteIndex = notesData.findIndex(
      (note) => note.id === parseInt(req.params.id)
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const deletedNote = notesData.splice(noteIndex, 1)[0];
    console.log('Deleted note:', deletedNote);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
