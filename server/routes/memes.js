const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST a new meme with an image upload
router.post('/', upload.single('image'), async (req, res) => {
  const { title, caption, creatorId, tags: tagsString, vibe } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Meme image is required.' });
  }

  // Ensure creatorId is an integer
  const creatorIdInt = parseInt(creatorId, 10);
  if (isNaN(creatorIdInt)) {
    return res.status(400).json({ error: 'Invalid creator ID.' });
  }

  // Process tags from comma-separated string to an array
  const tags = (tagsString && typeof tagsString === 'string')
    ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    : [];

  try {
    const imageUrl = `/public/uploads/${req.file.filename}`;
    
    const newMeme = await prisma.meme.create({
      data: {
        title,
        caption,
        vibe,
        imageUrl,
        creatorId: creatorIdInt,
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        creator: true,
        tags: true,
      },
    });
    res.status(201).json(newMeme);
  } catch (error) {
    console.error('Failed to create meme:', error);
    res.status(500).json({ error: 'Failed to create meme' });
  }
});

// GET top 3 trending memes
router.get('/trending', async (req, res) => {
  try {
    const trendingMemes = await prisma.meme.findMany({
      take: 3,
      orderBy: {
        upvotes: 'desc',
      },
      include: {
        creator: { select: { username: true } },
        tags: { select: { name: true } },
        votes: true,
      },
    });
    res.json(trendingMemes);
  } catch (error) {
    console.error('Failed to fetch trending memes:', error);
    res.status(500).json({ error: 'Failed to fetch trending memes' });
  }
});

// GET all memes------------------------------------->>>>>>>>
router.get('/', async (req, res) => {
  try {
    const memes = await prisma.meme.findMany({
      include: {
        creator: {
          select: {
            username: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(memes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch memes' });
  }
});

// POST /api/memes/:id/vote------------------->>>>>.......
router.post('/:id/vote', async (req, res) => {
  const memeId = parseInt(req.params.id);
  const { voteType, userId } = req.body; // 'up' or 'down'

  if (!userId || !voteType || !['up', 'down'].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid request: requires valid userId and voteType ("up" or "down")' });
  }

  const voteValue = voteType === 'up' ? 1 : -1;

  try {
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_memeId: { userId, memeId },
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existingVote) {
        if (existingVote.value === voteValue) {
          // User is removing their vote
          await tx.vote.delete({ where: { id: existingVote.id } });
          await tx.meme.update({
            where: { id: memeId },
            data: {
              [voteType === 'up' ? 'upvotes' : 'downvotes']: { decrement: 1 },
            },
          });
        } else {
          // User is switching their vote
          await tx.vote.update({
            where: { id: existingVote.id },
            data: { value: voteValue },
          });
          await tx.meme.update({
            where: { id: memeId },
            data: {
              upvotes: {
                [voteType === 'up' ? 'increment' : 'decrement']: 1,
              },
              downvotes: {
                [voteType === 'down' ? 'increment' : 'decrement']: 1,
              },
            },
          });
        }
      } else {
        // First time voting
        await tx.vote.create({
          data: { userId, memeId, value: voteValue },
        });
        await tx.meme.update({
          where: { id: memeId },
          data: {
            [voteType === 'up' ? 'upvotes' : 'downvotes']: { increment: 1 },
          },
        });
      }
    });

    const updatedMeme = await prisma.meme.findUnique({
      where: { id: memeId },
      include: {
        creator: { select: { username: true } },
        tags: { select: { name: true } },
        votes: true,
      },
    });

    res.json(updatedMeme);
  } catch (error) {
    console.error(`Failed to process ${voteType}vote:`, error);
    res.status(500).json({ error: `Failed to process ${voteType}vote` });
  }
});

module.exports = router; 