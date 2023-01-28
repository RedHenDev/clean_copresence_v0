const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + 'index.html'));
// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });



// Store the players' positions in an object
let players = {};

io.on('connection', socket => {
  console.log(`Player ${socket.id} connected`);

  // Send the current list of players to the new player
  socket.emit('currentPlayers', players);

  // Add the new player to the players object
  players[socket.id] = {
    x: 0,
    y: 0
  };

  socket.on('disconnect', () => {
    console.log(`Player ${socket.id} disconnected`);
    // Remove the player from the players object
    delete players[socket.id];
    // Send the updated players object to all remaining players
    io.emit('disconnect', socket.id);
  });

  socket.on('playerMovement', movementData => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    // Send the updated players object to all players
    io.emit('updatePlayers', players);
  });
});

server.listen(3000, () => {
    console.log('hark to port 3000');
  });
