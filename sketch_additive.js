// // //--------------------------------------------------------------------------VERSION 7----------------------------------------------------------------------------------------------------------------------
// // //Drawing any arbitrary path using only 1 epicycle

const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX; 

let time = 0;
let path = [];

let drawing = [];
let state = -1;

function mousePressed(){
  state = USER;
  drawing = []; //resets the drawing array to empty array
  // x = []; //resets x array
  // time = 0; //resets time after complition 
  // path = []; //resets paths
}

function mouseReleased(){
  state = FOURIER;
  
  const skip = 1;
  for(let i = 0; i< drawing.length; i+=skip)
  {
    const c = new Complex(drawing[i].x, drawing[i].y);
    x.push(c);  
  }

  fourierX = dft(x);

  fourierX.sort((a,b) => b.amp - a.amp);
}

// let slider;



function setup() {
  createCanvas(windowWidth, windowHeight );
  state = -1;
  // // slider = createSlider(1 , 100, 1);
}



function epiCycles(x , y, rotation, fourier){
  for(let i = 0; i< fourier.length; i++){
    let prevx = x;
    let prevy = y;

    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);
 
  
    //MAKES THE BIG MAIN CIRCLE
    stroke(255, 50); //(color, transparancy)
    noFill();
    ellipse(prevx,prevy, radius*2);

    //radius of each circle
    stroke(255,250,210,125);
    line(prevx,prevy,x,y);

  }
  return createVector(x , y);
}


// draw function loops over and over
function draw() {
  background(0);

  //user drawing mode
  if(state == USER){
      let point = createVector(mouseX - width/2, mouseY - height/2);
      drawing.push(point);
      stroke('red');
      noFill();
      beginShape();
      for (let v of drawing){
        vertex(v.x + width/2, v.y + height/2);
      }
      endShape();
  }

//path drawing mode
  else if(state == FOURIER){

    let vx = epiCycles(width / 2, height / 2, 0, fourierX);
    path.unshift(vx);  // creates an array by adding values in the begining to plot all the y coordinates of the circle aka sin values
    stroke('blue');
    beginShape();
    noFill();
    for (let i = 0 ; i < path.length; i++){
      vertex(path[i].x, path[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierX.length;

    time += dt;


    if(time > TWO_PI){
      time = 0;
      path = [];
    }
  }
  // deletes the last value if the length of the wave array is more than 500 
  // if (wave.length > 150){
  //   wave.pop();
  // }

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}