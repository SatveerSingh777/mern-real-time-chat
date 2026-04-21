const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Groq = require('groq-sdk');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Initialize Groq
const groq = new Groq({
  apiKey: "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", 
});

// In-memory Room & Password Manager
const roomRegistry = {}; 

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // 1. DEFAULT STATE: Every user starts in 'global'
  socket.join('global');
  socket.currentRoom = 'global';

  // 2. JOIN PRIVATE ROOM LOGIC
  socket.on('joinPrivate', ({ room, password }) => {
    const roomName = room.toLowerCase().trim();

    // If room exists, check password
    if (roomRegistry[roomName]) {
      if (roomRegistry[roomName] !== password) {
        return socket.emit('errorMsg', 'Incorrect room key!');
      }
    } else {
      // Create new room if it doesn't exist
      if (password) roomRegistry[roomName] = password;
    }

    // Switch Rooms
    socket.leave(socket.currentRoom);
    socket.join(roomName);
    socket.currentRoom = roomName;

    // Tell the frontend to switch from WorldChat UI to PrivateChat UI
    socket.emit('roomJoined', roomName);
    console.log(`${socket.id} moved to PRIVATE: ${roomName}`);
  });

  // 3. EXIT TO WORLD CHAT LOGIC
  socket.on('goGlobal', () => {
    socket.leave(socket.currentRoom);
    socket.join('global');
    socket.currentRoom = 'global';

    // Tell the frontend to switch back to WorldChat UI
    socket.emit('roomJoined', 'global');
    console.log(`${socket.id} returned to WORLD CHAT`);
  });

  // 4. MESSAGE LOGIC (Universal for both UI files)
  socket.on('message', (data) => {
    if (socket.currentRoom) {
      // Send only to the specific room the user is in
      io.to(socket.currentRoom).emit('message', { 
        username: data.username, 
        message: data.message 
      });
    }
  });

  // 5. AI LOGIC (Scoped to the current room)
  socket.on('askAI', async (data) => {
    const room = socket.currentRoom;
    if (!room || !data.question) return;

    // Show user question in chat first
    io.to(room).emit('message', { username: data.username, message: data.question });

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful AI. Keep answers short and friendly." },
          { role: "user", content: data.question }
        ],
        model: "llama-3.1-8b-instant",
      });

      const reply = chatCompletion.choices[0]?.message?.content;
      io.to(room).emit('message', { username: '🤖 AI Bot', message: reply });
    } catch (err) {
      socket.emit('message', { username: '🤖 AI Bot', message: 'AI failed to respond.' });
    }
  });

  socket.on('disconnect', () => console.log('User left'));
});

server.listen(5000, () => console.log('Server running on port 5000'));