const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
require('dotenv').config();

let players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  // create a new player and add it to our players object
  players[socket.id] = {
    x: Math.random()*300+64,
    y: Math.random()*300+64
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);
  socket.broadcast.emit('currentPlayers', players);

  // update all other players of the new player
  //socket.broadcast.emit('newPlayer', players);

  // when a player moves, update the player data
  socket.on('playerMovement', function(movementData) {
    players[socket.id].x += movementData.x;
    players[socket.id].y += movementData.y;
    // emit a message to all players to update their positions
    socket.emit('playerMoved', players);
    socket.broadcast.emit('playerMoved', players);
  });

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function() {
    console.log('user disconnected');
    delete players[socket.id];
    // emit a message to all players to remove the disconnected player
    io.emit('subDisconnect', socket.id);
  });
});

const port = process.env.PORT;
server.listen(port || 8080, function() {
  console.log(`Listening on ${server.address().port}`);
});
