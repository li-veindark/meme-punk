const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For mock users, we don't need password verification
    res.json({
      user,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});



module.exports = router; 