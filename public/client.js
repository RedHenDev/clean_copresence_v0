const socket = io();
let players = {};
let playerId;

// listen for the currentPlayers event and update the positions of other players
socket.on('currentPlayers', function(players) {
  Object.keys(players).forEach(function(id) {
    if (players[id].playerId === socket.id) {
      addPlayer(players[id]);
    } else {
      console.log('add other players?');
      //addOtherPlayers(players[id]);
    }
  });
});

// listen for the newPlayer event and add new player
socket.on('newPlayer', function(playerInfo) {
  addOtherPlayers(playerInfo);
});

// listen for the playerMoved event and update the position of other players
socket.on('playerMoved', function(playerInfo) {
  movePlayer(playerInfo.playerId, playerInfo.x, playerInfo.y);
});

// listen for the disconnect event and remove the disconnected player
socket.on('subDisconnect', function(playerId) {
  removePlayer(playerId);
});

// send player movement data to the server
document.onkeydown = function(event) {
  if (event.code === 'ArrowLeft') {
    socket.emit('playerMovement', { x: -5, y: 0 });
  } else if (event.code === 'ArrowRight') {
    socket.emit('playerMovement', { x: 5, y: 0 });
  } else if (event.code === 'ArrowUp') {
    socket.emit('playerMovement', { x: 0, y: -5 });
  } else if (event.code === 'ArrowDown') {
    socket.emit('playerMovement', { x: 0, y: 5 });
  }
};

let sub;
function preload(){
  sub=loadImage('player.png');
}

function setup(){
  createCanvas(400,400);
  background(0);
  playerId = Math.floor(Math.random() * 10000);
    
    socket.emit('playerId', playerId);
    socket.on('playerPositions', newPositions => {
        playerPositions = newPositions;
    });
}

function draw(){
  background(0);
  image(sub,playerId)
  for (let id in players) {
    image(sub,players[id].x, players[id].y, 10, 10);
  }
}
