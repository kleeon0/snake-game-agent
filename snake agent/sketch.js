var s;
var scl = 20;

var food;


function setup(){
  createCanvas(600, 600);
  s = new Snake();
  frameRate(10);
  pickLocation();
}

function draw(){
  background(51);

  if (s.eat(food)){
    pickLocation();
  }

  s.death();
  s.update();
  s.show();

  

  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
}
