const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const mockUsers = [
  {
    id: 1,
    username: "cyberpunk42"
  },
  {
    id: 2,
    username: "neon_hustler"
  },
  {
    id: 3,
    username: "meme_lord"
  },
  {
    id: 4,
    username: 'CyberNekoCoder'
  },
  {
    id: 5,
    username: 'PixelPup'
  },
  {
    id: 6,
    username: 'SynthTiger'
  }
];

const mockMemes = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    price: 0.042,
    title: 'Cyber-Cat Reflection',
    creator: 'CyberNekoCoder',
    caption: "Brain: Do it. Me: Why? Brain: For the plot.",
    vibe: "Dystopian LOLstorm",
    tags: ['cybercat', 'glitch', 'neon'],
    upvotes: 142,
    downvotes: 24,

  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&q=80",
    price: 0.031,
    title: 'Pixel Pup Dream',
    creator: 'PixelPup',
    caption: "Running on caffeine, chaos, and questionable decisions.",
    vibe: "Retro Glitch",
    tags: ['robot', 'cyberpunk', 'future'],
    upvotes: 98,
    downvotes: 12,

  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80",
    price: 0.055,
    title: 'Synthwave Tiger',
    creator: 'SynthTiger',
    caption: "I came. I saw. I overthought everything.",
    vibe: "Vaporwave Victory",
    tags: ['80s', 'synth', 'neonwave'],
    upvotes: 201,
    downvotes: 8,

  },
  {
    id: 4,
    image: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3Vkb3RyMWV0bWxyaDcxaGdndGRhdjMwZnB1ZmpyajM2czFrdDYxaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FIxjQGnjmNt5u/giphy.gif",
    price: 0.042,
    title: "Neon Nap Mode",
    creator: "CyberNekoCoder",
    caption: "Sleep is for the weak... said my insomnia.",
    vibe: "Digital Daze",
    tags: ['gif', 'glitch', 'restless'],
    upvotes: 142,
    downvotes: 24,

  },
  {
    id: 5,
    image: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGd2M3l3b2x4N3U1cm84YWs1bzZxNnA3Z2lhNmhmenpkYjlycnJycSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7kn27lnYSAE9O/giphy.gif",
    price: 0.031,
    title: "Task Ninja Mode",
    creator: "PixelPup",
    caption: "Me, pretending to be busy so I don't get more tasks.",
    vibe: "Stealthy Sarcasm",
    tags: ['busy', 'gif', 'workvibes'],
    upvotes: 98,
    downvotes: 12,

  },
  {
    id: 6,
    image: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHgzNndhNDNrOXdhanlmeDdsdHphNHZnMDJxajB6djMyaDZubWpoYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11xBk5MoWjrYoE/giphy.gif",
    price: 0.055,
    title: "Multitask Champion",
    creator: "SynthTiger",
    caption: "Currently holding the world record for most tabs opened.",
    vibe: "Burnout Ballet",
    tags: ['multitask', 'gif', 'taboverload'],
    upvotes: 201,
    downvotes: 8,

  }
];


async function main() {
  console.log('Start seeding...');

  for (const user of mockUsers) {
    const createdUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
    console.log(`Created user with id: ${createdUser.id}`);
  }

  for (const meme of mockMemes) {
    const user = mockUsers.find(u => u.username === meme.creator);
    if (!user) {
      console.error(`User not found for meme creator: ${meme.creator}`);
      continue;
    }

    const createdMeme = await prisma.meme.create({
      data: {
        title: meme.title,
        imageUrl: meme.image,
        caption: meme.caption,
        vibe: meme.vibe,
        price: meme.price,

        upvotes: meme.upvotes,
        downvotes: meme.downvotes,

        creator: {
          connect: { id: user.id }
        },
        tags: {
          connectOrCreate: meme.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      }
    });
    console.log(`Created meme with id: ${createdMeme.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 