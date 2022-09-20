const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./src/messages.js');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getUserRoom,
} = require('./src/Users.js');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const bot = 'ChatBot';
// set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Runs when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //produce message for the connected client
    socket.emit('message', formatMessage(bot, 'welcome to chat'));

    //Broadcast to all the client except the client connecting..
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(bot, `${user.username} has joined the chat`)
      );

    //Display user and room info
    io.to(user.room).emit('usersRoom', {
      room: user.room,
      users: getUserRoom(user.room),
    });
  });

  // listen for chat message
  socket.on('chatMessage', function (msg) {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //client disconnet
  socket.on('disconnect', function () {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(bot, `${user.username} has left the chat`)
      );
    }
  });
});

// server.listen(3000 || process.env.PORT, function () {
//   console.log("server running on port 3000");
// });
server.listen(process.env.PORT || 3000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});
