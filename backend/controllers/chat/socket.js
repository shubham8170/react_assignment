// const socketIo = require('socket.io');
// const { getUserInfo, storeChats } = require('./index');

const connectSocket = (server) => {
  try {
    const io = socketIo(server, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      // Handle user joining a room
      socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        // console.log(`User joined room: ${roomName}`);
        // io.to(roomName).emit('message', 'User joined the room.');
      });

      // Handle incoming messages
      socket.on('sendMessage', (roomName, message) => {
        // You can process and store the message here
        // Example: storeChats({ senderId: socket.id, message });

        io.to(roomName).emit('message', message);
      });

      // Handle user disconnection
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  } catch (err) {
    console.log('Failed to connect with Socket.IO', err.message);
  }
};

module.exports = { connectSocket };
