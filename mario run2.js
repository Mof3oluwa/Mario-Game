let map,ground,brick,questionBox,pipe;
let tileSize = 16;
let brickImg, groundImg,qImg,topleft,topright,rightImg,leftImg, marioImg, goombaImg;
let mario, goomba;
//new stuff
let top_Sensor,bottom_Sensor

//
function preload()
{
  brickImg = loadImage('brick.png')
  groundImg = loadImage('ground.png')
  qImg = loadImage('question.png')
  leftImg = loadImage('pipeleft.png')
  rightImg = loadImage('pipeRight.png')
  topleft = loadImage('pipeTopLeft.png')
  topright = loadImage('pipeTopRight.png')
  marioImg = loadImage('Mario.png')
  goombaImg = loadImage('goomba.png')
}
function setup() {
  createCanvas(windowWidth, 224);
//new stuff


  walkable = new Group()
  //end
  world.gravity.y = 40;

  ground = new walkable.Group();
  ground.collider = 's';
  ground.image = groundImg;
  ground.tile = '=';
  ground.w = tileSize;
  ground.h = tileSize;

  brick = new walkable.Group()
  brick.collider = 's'
  brick.image = brickImg
  brick.tile = 'b'
  brick.w = 16;
  brick.h = 16;

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

  goomba = new Group();
  goomba.collider = 'd'
  goomba.rotationLock = true;
  goomba.image = goombaImg
  goomba.tile = 'g';
  goomba.w = 16;
  goomba.h = 16;
  goomba.facing = -1;

  mario = new Sprite(54,100,30,30);
  mario. rotationLock = true;
  mario.spriteSheet = marioImg;
  mario.anis.frameDelay = 4;
  mario.addAnis({
    run: { row:0, frames:1},
    stand:{ row:0, frames:1},
  });
  mario.scale = 0



  //creating joint 
  top_Sensor = new Sprite(mario.x,mario.y-mario.h/2);
  bottom_Sensor = new Sprite(mario.x,mario.y+mario.h/2)

  top_Sensor.w = mario.w/2
  top_Sensor.h = 2
  bottom_Sensor.w = mario.w/2;
  top_Sensor.visible = false;
  bottom_Sensor.h = 2;
  bottom_Sensor.visible = false;
  let bottomJoint = new GlueJoint(mario,bottom_Sensor)
  let topJoint = new GlueJoint(mario,top_Sensor)
  topJoint.visible = false;
  bottomJoint.visible =false;
  // hitting;
   bottom_Sensor.overlaps(goomba, (s, g) => {
     g.remove();
  });
  top_Sensor.overlaps(questionBox, (s, q) => {

     q.image = brickImg
    console.log(q.tile)
  });

  new Tiles(
    [

      '........................................................................................................................................................................................................................................................................................',
      '........................................................................................................................................................................................................................................................................................',
      '...................................................................................g.g..................................................................................................................................................................................................',
      '...................................................................................bbbbbbbb...bbb?.......................?.............bbb.....b??b.....................................................................................................................................',
      '.......................?.............................................................................................................................................................................................bb.................................................................',
      '....................................................................................................................................................................................................................bbb.................................................................',
      '...................................................................................................................................................................................................................bbbb.................................................................',
      '................?....b?b?b...................................................b?b.................?.....b?.....bb......?..?..?......b............bb................................................................bbbbb.................bb..............................................',
      '...............................................lr.........lr.............................................................................................b..b............bb..b...................................bbbbbb................bbbb.............................................',
      '.......................................lr......LR.........LR............................................................................................bb..bb..........bbb..bb..............bb?b...............bbbbbbb...............bbbbbb............................................',
      '............................lr.........LR......LR.........LR...........................................................................................bbb..bbb........bbbb..bbb.......lr...................lr.bbbbbbbb...............bbbbbb............................................',
      '.......................g....LR.........LR..g...LR....g.g..LR...........................................g.g............................................bbbb..bbbb......bbbbb..bbbb......LR............g.g....LRbbbbbbbbb.........b.....bbbbbb............................................',
      '======================================================================..===============...=================================================================================..===========================================================================================================',
      '======================================================================..===============...=================================================================================..===========================================================================================================',

    ],

    0,
    16,
    tileSize,
    tileSize - 1);


  for(g of goomba)
    {
      g.vel.x = -1
    }


}

function draw() {
  clear()
  background(92, 148, 252)
  moveMario()
  moveEnemies()
 OOB()
  if(mario.x < 0)
  {
    camera.x = 10;
  }
  else
  {
    camera.x = mario.x;
  }
}
function moveEnemies()
{

   for (g of goomba) { 
     g.vel.x = floor(g.facing)
      if (g.colliding(pipeLeft) > 2) {
     g.facing *= -1 
    }
      if (g.colliding(goomba) > 1) {
        g.facing *= -1 
     } 
      if (g.colliding(pipeRight) > 2) {
    g.facing *= -1 
    }

  }
}
function moveMario()
{
  if(kb.pressing('d'))
  {
   mario.vel.x = 2;
   mario.ani = 'run'
  mario.mirror.x = false;
  }
   else if(kb.pressing('a'))
  {
       mario.vel.x = -2;
   mario.ani = 'run'
  mario.mirror.x = true;
  }
  else
   {
     mario.ani = 'stand'
   }
//this changes
  if(kb.presses('space') && bottom_Sensor.overlapping(walkable))
  {
    mario.vel.y = -10
  }

  if(mario.overlapping(goomba) >1) {
     reset()
  }
}

function reset()
{
  mario.x = 32
  mario.y = 100
  top_Sensor.x = mario.x
  top_Sensor.y = mario.y-mario.h/2;
  bottom_Sensor.x = mario.x
  bottom_Sensor.y = mario.y  +mario.h/2
}

function OOB()
{
  if(mario.y < 10 || mario.y > 200){
   mario.lives -=1;
   reset()
  }
}

