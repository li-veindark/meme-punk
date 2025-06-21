const prisma = require('../prisma/client');

async function processFinishedDuels() {
  const now = new Date();

  // Find active duels whose endTime has passed
  const finishedDuels = await prisma.duel.findMany({
    where: {
      status: 'ACTIVE',
      endTime: {
        lte: now,
      },
    },
    include: {
      bids: true,
      memeA: true,
      memeB: true,
    },
  });

  if (finishedDuels.length === 0) {
    // console.log('No finished duels to process.');
    return;
  }

  console.log(`Found ${finishedDuels.length} finished duel(s) to process.`);

  for (const duel of finishedDuels) {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Calculate total bids for each meme
        const bidsA = duel.bids.filter(b => b.memeId === duel.memeAId);
        const bidsB = duel.bids.filter(b => b.memeId === duel.memeBId);
        const totalA = bidsA.reduce((sum, b) => sum + b.amount, 0);
        const totalB = bidsB.reduce((sum, b) => sum + b.amount, 0);

        // 2. Determine the winner
        const winningBids = totalA >= totalB ? bidsA : bidsB;
        
        console.log(`Processing Duel #${duel.id}: MemeA (${totalA} ETH) vs MemeB (${totalB} ETH).`);

        // 3. Pay out winnings (2x the bid amount)
        if (winningBids.length > 0) {
          console.log(`Paying out ${winningBids.length} winning bid(s)...`);
          for (const bid of winningBids) {
            await tx.user.update({
              where: { id: bid.userId },
              data: {
                ethBalance: {
                  increment: bid.amount * 2,
                },
              },
            });
            console.log(`  - User ${bid.userId} awarded ${bid.amount * 2} ETH.`);
          }
        }

        // 4. Mark the duel as FINISHED
        await tx.duel.update({
          where: { id: duel.id },
          data: { status: 'FINISHED' },
        });

        console.log(`Duel #${duel.id} successfully processed and marked as FINISHED.`);
      });
    } catch (error) {
      console.error(`Error processing duel #${duel.id}:`, error);
      // If a transaction fails, we might want to mark it as 'FAILED' to avoid reprocessing
      await prisma.duel.update({
        where: { id: duel.id },
        data: { status: 'FAILED' },
      });
    }
  }
}

function startDuelProcessor() {
  console.log('Starting duel processor service...');
  // Run every 15 seconds
  setInterval(processFinishedDuels, 15000);
}

module.exports = { startDuelProcessor }; 