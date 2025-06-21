require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'X-User-1D']
  }
});

// Import routes
const userRoutes = require('./routes/users');
const memeRoutes = require('./routes/memes');
const aiRoutes = require('./routes/ai');
const duelRoutes = require('./routes/duels');
console.log("✅ duelRoutes loaded from ./routes/duels.js");
const { startDuelProcessor } = require('./services/duelProcessor');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use('/public', express.static('public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/duels', duelRoutes);
console.log("✅ /api/duels route registered");

// Sample route
app.get("/", (req, res) => res.send("MemeHustle API is live!"));

// WebSocket logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('vote', (data) => {
    io.emit('update-votes', data);
  });

  socket.on('bid', (data) => {
    io.emit('update-bids', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start the duel processing service
startDuelProcessor();
