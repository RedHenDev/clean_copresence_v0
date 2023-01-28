const socket = io();
let players = {};

// Listen for the currentPlayers event and update the players object
socket.on('currentPlayers', data => {
  players = data;
});

// Listen for the updatePlayers event and update the positions of the players
socket.on('updatePlayers', data => {
  players = data;
});

// Listen for the disconnect event and remove the disconnected player
socket.on('disconnect', playerId => {
  delete players[playerId];
});

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  // Display all players
  for (let id in players) {
    rect(players[id].x, players[id].y, 10, 10);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    players[socket.id].x -= 5;
  } else if (keyCode === RIGHT_ARROW) {
    players[socket.id].x += 5;
  } else if (keyCode === UP_ARROW) {
    players[socket.id].y -= 5;
  } else if (keyCode === DOWN_ARROW) {
    players[socket.id].y += 5;
  }

  // Send the updated player position to the server
  socket.emit('playerMovement', players[socket.id]);
}
