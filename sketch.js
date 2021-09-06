const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var zombie;
var zombie1;
var breakButton;
var backgroundImage;
var sadZombie, sad;

var stones = [];

function preload() {
  zombie1 = loadImage("./assets/zombie.png");

  sadZombie = loadImage("./assets/sadZombie.jpg");

  backgroundImage = loadImage("./assets/background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(30, { x: 50, y: height / 2 - 140 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }

  zombie = createSprite(width / 2, height - 110);
  zombie.addAnimation("zombie", zombie1);
  zombie.scale = 0.1;
  zombie.velocityX = 10;

  sad = createSprite(100,100,20,20);
  sad.addImage("crying",sadZombie);
  sad.scale = 0.1;
  sad.visible = false;

  breakButton = createButton("BreakButton");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  bridge.show();

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    var distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);
    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("crying");
      sad.visible = true;
      collided = true;
    }
  }

  drawSprites();
}

function handleButtonPress() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}