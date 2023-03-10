const socket = io();
let players = {};
let playerId;
let shade;

// listen for the currentPlayers event and update the positions of other players
socket.on('currentPlayers', function(playersI) {
  console.log(`Got updated list of players, mom!`);
  players=playersI;
  renderAll();
});

// listen for the newPlayer event and add new player
// socket.on('newPlayer', function(newplayers) {
//   console.log(`Newbie, mom!`);
//   //addOtherPlayers(playerInfo);
//   players=newplayers;
// });

// listen for the playerMoved event and update the position of other players
socket.on('playerMoved', function(playerInfo) {
  players=playerInfo;
  renderAll();
  //movePlayer(playerInfo.playerId, playerInfo.x, playerInfo.y);
});

// listen for the disconnect event and remove the disconnected player
socket.on('subDisconnect', function(playerId) {
  delete players[playerId];
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

function renderAll(){
  background(0);
  for (let id in players) {
    fill(players[id].shade);
    circle(players[id].x,players[id].y,42);
    image(sub,players[id].x, 
              players[id].y 
              );
  }
}

function setup(){
  createCanvas(400,400);
  background(0);
  imageMode(CENTER);
  rectMode(CENTER);
  //playerId = Math.floor(Math.random() * 10000);
  let whatColour = Math.floor(Math.random()*4);
  if (whatColour===0){
    shade=[255,0,0];
  } else if (whatColour===1){
    shade=[0,255,0];
  } else if (whatColour===2){
    shade=[0,0,255];
  } else {
    shade=[255,255,255];
  }
    
    //socket.emit('playerId', playerId);
    socket.emit('playerShade',shade);
    // socket.on('playerPositions', newPositions => {
    //     playerPositions = newPositions;
    // });
}

function draw(){
  //background(0);
  //image(sub,playerId)
  //image(sub,42,42);
  //renderAll();
}

