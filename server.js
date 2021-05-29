const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatBot';

io.on('connection', socket => {

  socket.on('joinRoom', ({username, room }) => {
    const user = userJoin(socket.id, username, room); 

    socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Welcome to Chat'));

    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
  
  });

  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'));
  });
  

  socket.on('chatMessage', msg => {
    io.emit('message', formatMessage('USER', msg));
  });
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));