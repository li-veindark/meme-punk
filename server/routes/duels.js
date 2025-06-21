const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// Utility to fetch two random memes
const getTwoRandomMemes = async () => {
  const memes = await prisma.meme.findMany();
  if (memes.length < 2) throw new Error('Not enough memes to create a duel.');

  let [index1, index2] = [Math.floor(Math.random() * memes.length), null];
  do {
    index2 = Math.floor(Math.random() * memes.length);
  } while (index1 === index2);

  return [memes[index1], memes[index2]];
};

// POST /api/duels - Create a new duel
router.post('/', async (req, res) => {
  try {
    await prisma.duel.updateMany({
      where: { status: 'ACTIVE' },
      data: { status: 'FINISHED' }
    });

    const [memeA, memeB] = await getTwoRandomMemes();

    const duel = await prisma.duel.create({
      data: {
        memeAId: memeA.id,
        memeBId: memeB.id,
        status: 'ACTIVE'
      },
      include: {
        memeA: { include: { creator: true } },
        memeB: { include: { creator: true } }
      }
    });

    res.status(201).json(duel);
  } catch (err) {
    console.error('Create Duel Error:', err);
    res.status(500).json({ error: err.message || 'Failed to create duel.' });
  }
});

// GET /api/duels/active - Get the active duel
router.get('/active', async (req, res) => {
  try {
    const duel = await prisma.duel.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'desc' },
      include: {
        memeA: { include: { creator: true, tags: true, votes: true } },
        memeB: { include: { creator: true, tags: true, votes: true } },
        bids: { include: { user: true } }
      }
    });

    if (!duel) return res.status(404).json({ message: 'No active duel found.' });
    res.json(duel);
  } catch (err) {
    console.error('Fetch Duel Error:', err);
    res.status(500).json({ error: 'Failed to fetch active duel.' });
  }
});

// POST /api/duels/:duelId/memes/:memeId/bid - Place a bid
router.post('/:duelId/memes/:memeId/bid', async (req, res) => {
  const duelId = parseInt(req.params.duelId);
  const memeId = parseInt(req.params.memeId);
  const { userId, amount } = req.body;

  const bidAmount = parseFloat(amount);
  if (!userId || isNaN(bidAmount) || bidAmount <= 0) {
    return res.status(400).json({ error: 'Invalid user ID or bid amount.' });
  }

  try {
    const updatedData = await prisma.$transaction(async (tx) => {
      // 1. Get duel details and lock the record
      const duel = await tx.duel.findUnique({
        where: { id: duelId },
      });

      if (!duel) throw new Error('Duel not found.');
      if (duel.status !== 'ACTIVE') throw new Error('This duel is no longer active.');
      if (duel.memeAId !== memeId && duel.memeBId !== memeId) {
        throw new Error('Meme is not part of this duel.');
      }
      
      // 2. Check if this is the first bid and start the timer if so
      let updatedDuel = duel;
      if (!duel.startTime) {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 10 * 60 * 1000); // 10 minutes
        updatedDuel = await tx.duel.update({
          where: { id: duelId },
          data: { startTime, endTime },
        });
      }

      // 3. Get user and check balance
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found.');
      if (user.ethBalance < bidAmount) throw new Error('Insufficient balance.');

      // 4. Create the bid
      await tx.bid.create({
        data: {
          amount: bidAmount,
          userId,
          duelId,
          memeId
        }
      });

      // 5. Decrement user's balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { ethBalance: { decrement: bidAmount } }
      });

      return { user: updatedUser, duel: updatedDuel };
    });

    res.json({ message: 'Bid placed successfully.', ...updatedData });
  } catch (err) {
    console.error('Bid Error:', err);
    res.status(400).json({ error: err.message || 'Failed to place bid.' });
  }
});

module.exports = router;
