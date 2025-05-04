// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8000 });

const clients = new Set();

server.on('connection', (socket) => {
  console.log('Client connected');
  clients.add(socket);

  socket.on('message', (message) => {
    console.log('Received:', message);

    // Broadcast to all other clients
    for (const client of clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    clients.delete(socket);
  });
});

console.log('Broadcast WebSocket server running on port 8000');
