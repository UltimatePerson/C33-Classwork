const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var ground, rope, rope2, rope3, fruit, fruit_con, fruit_con2, fruit_con3;

let engine;
let world;

var bg_img;
var food;
var bunny_img;

var button, button2, button3;
var bunny;

var blink, eat, sad;

var bk_sound, eatingSound, sadSound, cutSound, airSound;

var blower, muteButton;

function preload() {
  bg_img = loadImage('background.png')
  food = loadImage("melon.png")
  bunny_img = loadImage("Rabbit-01.png")

  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;

  bk_sound = loadSound("sound1.mp3");
  eatingSound = loadSound("eating_sound.mp3")
  sadSound = loadSound("sad.wav");
  cutSound = loadSound("rope_cut.mp3");
  airSound = loadSound("air.wav");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bk_sound.play();
  bk_sound.setVolume(0.5);
  frameRate(80);
  blink.frameDelay = 20;
  sad.frameDelay = 20;
  eat.frameDelay = 20;

  engine = Engine.create();
  world = engine.world;

  button = createImg('cut_btn.png');
  button.position(width/2, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position (width /2 +150, 230)
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(50, 30)
  button3.size(50, 50)
  button3.mouseClicked(drop3);

  muteButton = createImg('mute.png');
  muteButton.position(width -100,20);
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);

  //blower = createImg('balloon.png');
  //blower.position(100,300);
  //blower.size(100,100);
 //blower.mouseClicked(airBlow);

  ground = new Ground(width /2, height -10, width, 20);
  rope = new Rope(5, {
    x: width /2 +20,
    y: 20
  });
  
  rope2 = new Rope(3, {
    x: width/2 +200,
    y:250
  })

  rope3 = new Rope(15, {
    x: 50,
    y: 30
  })

  fruit = Bodies.circle(300, 200, 30);
  Matter.Composite.add(rope.body, fruit);
  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);

  bunny = createSprite(width /2, 620);
  bunny.scale = 0.25

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);

  bunny.changeAnimation("blinking");

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() {
  background(51);
  image(bg_img, 0, 0, width, height);
  Engine.update(engine)
  ground.show()
  rope.show()
  rope2.show()
  rope3.show()

  if (fruit != null) {
    push()
    image(food, fruit.position.x, fruit.position.y, 100, 100)
    pop()
  }

  if(collide(fruit, bunny) == true){
    bunny.changeAnimation("eating");
    eatingSound.play();
  }

  if(fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation("crying");
    sadSound.play();
    fruit = null
    bk_sound.stop();
  }

  drawSprites()

}

function drop() {
  rope.break();
  fruit_con.detatch();
  fruit_con = null;
}

function drop2(){
  rope2.break();
  fruit_con2.detatch();
  fruit_con2 = null;
}

function drop3(){
  rope3.break();
  fruit_con3.detatch();
  fruit_con3 = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 70) {
      World.remove(world, fruit)
      fruit = null
      return true
    } else {
      return false
    }
  }
}

function mute(){
  if (bk_sound.isPlaying()){
    bk_sound.stop();
  }else{
    bk_sound.play();
  }
}

function airBlow(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0})
  airSound.play();
}