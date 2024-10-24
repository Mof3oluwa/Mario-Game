let player, playing, walls, questionBox, pipe;
let playerImg, bgImg, floorTile1, floorTile2,floorTile3, grassImg, dirtImg,startScreen, coinImg, doorImg, enemyImg, qImg,topleft,topright,rightImg,leftImg;
let groundSensor;
let grass;
let jump = -4.5
//music stuff
let backgroundMusic
let coinsound;
let score = 0
let level;
let loading
function preload(){
  //load all the player animations
  player = new Sprite(50,100,34.5,50)
  playerImg = loadImage('Mario.png')
  player.spriteSheet = playerImg
  player.rotationLock = true;
  player.friction = 0;
  player.addAnis({
    stand: {row:0, frames:1},
    run: { row:0, frames:4},
  });
  player.ani = 'stand'
  
 
  //load all the images
  bgImg = loadImage('bg.png')
  floorTile1 = loadImage('ground.png')
  floorTile2 = loadImage('f2.png')
  floorTile3 = loadImage('ground.png')
  qImg = loadImage('question.png')
  leftImg = loadImage('pipeleft.png')
  rightImg = loadImage('pipeRight.png')
  topleft = loadImage('pipeTopLeft.png')
  topright = loadImage('pipeTopRight.png')
  grassImg = loadImage('16bitTileSetSep_17.png')
  dirtImg = loadImage('16bitTileSetSep_04.png')
  waterImg = loadImage('16bitTileSetSep_18.png')
  startScreen = loadImage('startscreen.png')
  doorImg = loadImage('door.png')
  coinImg= loadImage('coin.png')
  button = loadImage('startbtn.png')
  enemyImg = loadImage('goomba.png')

  //create a coin group
  coin = new Group()
  coin.w = 32
  coin.h = 32
  coin.spriteSheet = coinImg
   coin.addAnis({
    spin: {row:0, frames:9},
  });
  coin.tile = 'o'
  coin.collider = 'static'
  coin.rotationLock = true;

  backgroundMusic = loadSound("bg.mp3") //https://opengameart.org/content/8-bit-rpg-theme-their-sweet-memories
  coinsound = loadSound('coin.wav')
  
}
function setup() {
  createCanvas(160, 160,'pixelated x4');
  // variables to set between start menu and playing
  playing = false;
  world.autoStep = false;
  world.gravity.y = 12;
  player.scale = 0.4
  //change the players size for the movement
  player.w = 10
  player.h = 15
  //create a groundsensor
  groundSensor = new Sprite(player.x,player.y + player.h/2+3,player.w, 1)//changes here
  groundSensor.visible = false;
  groundSensor.mass = 0.01;
  let joint = new GlueJoint(player,groundSensor)
  joint.visible = false;
 
  //remove coins
    player.overlaps(coin, (p, c) => {
		 c.remove();
      coinsound.play();
      score +=1
	});
  
  
  //create the map
  walkable = new Group()
  walkable.layer = 1;
 
  //creating tiles
  f1 = new walkable.Group();
  f1.w = 16;
  f1.h = 16;
  f1.tile = "=";
  f1.collider = 'static';
  f1.image = floorTile1
  
  f2 = new walkable.Group();
  f2.w = 16;
  f2.h = 15;
  f2.tile = "c";
  f2.collider = 'static';
  f2.image = floorTile2

  f3 = new walkable.Group();
  f3.w = 16;
  f3.h = 16;
  f3.tile = "b";
  f3.collider = 'static';
  f3.image = floorTile3
  
  grass = new walkable.Group();
  grass.w = 16;
  grass.h = 5;
  grass.tile = "t";
  grass.image = grassImg
  grass.layer = 2;
	grass.collider = 'static';
  grass.offset.y = 5;

  
  dirtFloor = new walkable.Group();
  dirtFloor.w = 16;
  dirtFloor.h = 16;
  dirtFloor.tile = "d";
  dirtFloor.collider = 'static';
  dirtFloor.image = dirtImg

   questionBox = new walkable.Group()
  questionBox.collider = 's'
  questionBox.image = qImg
  questionBox.tile = '?'
  questionBox.w = 16;
  questionBox.h = 16;

  pipeLeft = new Group()
  pipeLeft.collider = 's'
  pipeLeft.image = leftImg
  pipeLeft.tile = 'L'
  pipeLeft.w = 16;
  pipeLeft.h = 16;

  pipeRight = new Group()
  pipeRight.collider = 's'
  pipeRight.image = rightImg
  pipeRight.tile = 'R'
  pipeRight.w = 16;
  pipeRight.h = 16;

  pipeTL = new walkable.Group()
  pipeTL.collider = 's'
  pipeTL.image = topleft
  pipeTL.tile = 'l'
  pipeTL.w = 16;
  pipeTL.h = 16;

  pipeTR = new walkable.Group()
  pipeTR.collider = 's'
  pipeTR.image = topright
  pipeTR.tile = 'r'
  pipeTR.w = 16;
  pipeTR.h = 16;

  water = new walkable.Group();
  water.w = 16;
  water.h = 5;
  water.tile = "w";
  water.collider = 'static';
  water.image = waterImg

  // creating collectables and game end

  door = new Group();
  door.w = 16;
  door.h = 20;
  door.tile = "x";
  door.collider = 'static';
  door.image = doorImg
   //new level
    player.overlaps(door, (p, d) => {
		levelTwo()
    coinsound.play();
     
	});
  coin.w = 16
  coin.h = 16
  coin.scale = 0.5
  

  enemy = new Group()
  enemy.w = 51;
  enemy.h = 50
  enemy.tile = "g"
  enemy.rotationLock = true
  enemy.friction = 0
  enemy.drag = 0
  enemy.vel.x = 0.2
  enemy.collider= 'd'
  enemy.spriteSheet = enemyImg;
  enemy.addAnis({
    run: { row:0, frames:8},
  });
 enemy.scale = 0.3
  enemy.w = 20
  enemy.h = 10
  enemy.debug = true;

  groundSensor.overlaps(enemy,(s,e)=>{
    if(player.vel.y >0){
      e.remove()
    }
  })
  player.overlaps(enemy,(p,e)=>{
    player.speed =0;
    player.x = 48
    player.y = 100
  })
  //tiled map
  level = new Tiles(
[      '........................................................................................................................................................................................................................................................................................',
'........................................................................................................................................................................................................................................................................................',
'...................................................................................g.g..................................................................................................................................................................................................',
'..........................................................oo..........oo...........bbbbbbbb...bbb?.......................?.............bbb.....b??b.....................................................................................................................................',
'.......................?.............................................................................................................................................................................................bb.................................................................',
'....................................................................................................................................................................................................................bbb.................................................................',
'...................................................................................................................................................................................................................bbbb.................................................................',
'................?....b?b?b...................................................b?b.................?.....b?.....bb......?..?..?......b............bb................................................................bbbbb.................bb..............................................',
'...............................................lr.........lr.............................................................................................b..b............bb..b...................................bbbbbb................bbbb.............................................',
'.......................................lr......LR.........LR........................ooo....oo....ooo......oo.....ooo....................................bb..bb..........bbb..bb..............bb?b.........ooo...bbbbbbb.....oooooo....bbbbbb..........ooo........ooo....................',
'............................lr.........LR......LR.........LR...........................................................................................bbb..bbb........bbbb..bbb.......lr...................lr.bbbbbbbb...............bbbbbb............................................',
'........ooo............g....LR....oo...LR..g...LR....g.g..LR................ooo........................g.g..........oooooo....................ooo.....bbbb..bbbb......bbbbb..bbbb......LR............g.g....LRbbbbbbbbb.........b.....bbbbbb....................oooooo..................',
'======================================================================..===============...=================================================================================..===========================================================================================================',
],
    16,
    16,
    f1.w-1,
    f2.h-1  
  );
  
}
function button(){
  startButton = new button()
  startButton.position(100,300)
  startButton.mousePressed(startGame)
  startButton.collider = 'k'
}

function draw() {
  clear();
  cursor("")
  //check if you are in the game or not
  if(playing){
   
      if (!backgroundMusic.isPlaying()) {
       backgroundMusic.play()
    }
    world.step()
  background(bgImg);
     fill(0)
    textSize(10)
    text("Coins:" + score,5,15)
   camera.x = player.x + 52;
  camera.y = player.y
     player.visible = true;
      walkable.visible = true;
    coin.visible= true;
  movement()
    enemiesMove()
  }
  else{
    background(startScreen)
    player.visible = false;
    backgroundMusic.stop()
    walkable.visible = false;
    coin.visible = false;
  
    if(kb.pressing('space')){
    playing = true
    backgroundMusic.play()
     
    }
  }
}
function movement(){
  //basic movement
    if(kb.pressing('a'))
  {
    player.vel.x = -1;
    player.ani = 'run'
     player.mirror.x = true;
  }
  else if(kb.pressing('d'))
  {
   player.vel.x = 1;
    player.ani = 'run'
    player.mirror.x = false;
  }
  else
  {
  player.ani = 'stand'
  player.vel.x = 0
}
  if(kb.pressing('space') && groundSensor.overlapping(walkable))
  {
    player.vel.y = jump;
    
  }
  // make the player slower in grass
	if (groundSensor.overlapping(grass) || groundSensor.overlapping(water)) {
		player.drag = 20;
		player.friction = 10;
    jump = -2.5
     player.h = 8
	} else {
		player.drag = 0;
		player.friction = 0;
    jump = -4.5
    player.h = 16
	}

  // if player falls, reset them
	if (player.y > 400) {
		player.speed = 0;
		player.x = 48;
		player.y = 100;
	}

}

function remove(p,c)
{
  c.remove()
}


function levelTwo()
{
  player.speed = 0;
	player.x = 48;
	player.y = 100;
  level.remove()
  level = new Tiles(
  [    
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
     '...........................',
    '...........................',
   '.........o.................',
   'abcggggabbcwwww.ac...abc...',
   'dddddddddddddddddddddddddd',],
    16,
    16,
    f1.w-1,
    f2.h-1
    
  );
  
}
function enemiesMove(){

  for(e of enemy){
    if(e.overlaps(f1) || e.overlaps(f3) || e.overlaps(coin)){
      e.vel.x *= -1
    }
    if(e.vel.x < 0 ){
      e.mirror.x = false
    }
    else{
      e.mirror.x = true
    }
  }
}

