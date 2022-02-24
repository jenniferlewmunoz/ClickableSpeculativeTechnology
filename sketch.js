
/***********************************************************************************
  ClickableAllocator
  by Scott Kildall
  student Jennifer Lew Munoz
  
  Start your localhost before running this, otherwise no PNGs will display

  Shows an example of how to use allocation tables with the
  modified p5.clickable class. This uses a ClickableManager class to
  (1) allocate and set variables from a .csv file
  (2) draw all the clickables that are visible in a single function


***********************************************************************************/

// the manager class
var clickablesManager;

// an array of clickable objects
var clickables;

// indexes into the array (constants)
const redIndex = 0;
const greenIndex = 1;
const yellowIndex = 2;
const inflateIndex = 3;
const deflateIndex = 4;

// constants for the balloon
const startEllipseDiameter = 30;
const poppedEllipseDiameter = 0;
const deflateAmount = 10;
const inflateAmount = 5;
const maxDiameter = 200;
const minDeflateDiameter = 5;

// variables for the ballon
var ellipseDiameter = startEllipseDiameter;

// pop sound
var popSound;

// constants for array of squares
const meterMaxIndex = 9;
var meter = [];
var meterIndex = 0;

// food images
let eLiquid;
let pLiquid;
let eCold;
let pCold;
let eHot;
let pHot;

// array of text options
var textOptions =
  ["Edible liquid pod, or plastic water bottle?",
    "Edible popsicle wrapper, or plastic popsicle wrapper?",
    "Veggie soup in celery flavored container, or plastic container?"];
var textIndex = 0;

// ALWAYS allocate the ClickableManager in the preload() function
// if you get an error here, it is likely the .csv file that is not the
// correct filename or path
function preload() {
  clickablesManager = new ClickableManager('assets/clickableLayout.csv');
  eLiquid = loadImage('assets/edible_liquid.png');
  pLiquid = loadImage('assets/plastic_liquid.png');
  eCold = loadImage('assets/edible_cold.png');
  pCold = loadImage('assets/plastic_cold.png');
  eHot = loadImage('assets/edible_hot.png');
  pHot = loadImage('assets/plastic_hot.png');
}

// ALWAYS call the setup() funciton for ClickableManager in the setup(), after
// the class has been allocated in the preload() function.
function setup() {
  createCanvas(600, 600);

  // load the pop sound
  soundFormats('mp3');
  popSound = loadSound('assets/pop.mp3');

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables();

  // start with a red balloon
  newBalloon(redIndex);

  // output to the message window
  console.log(clickables);

  // set all squares to false
  setupMeter();
}

// Just draw the button
function draw() {
  background(128);

  // draw "meter"
  drawMeter();

  // draw the p5.clickables
  clickablesManager.draw();

}

function setupMeter() {
  for (let i = 0; i <= meterMaxIndex; i++) {
    meter[i] = false;
  }
}

function drawMeter() {
  push();

  text(textOptions[textIndex], 100, 450);

  if (textIndex == 0) {
    image(eLiquid, 25, 200);
    image(pLiquid, 250, 200);
  } else if (textIndex == 1) {
    image(eCold, 25, 200);
    image(pCold, 250, 200);
  } else if (textIndex == 2) {
    image(eHot, 25, 200);
    image(pHot, 250, 200);
  }

  text("DANGER METER", 480, 450);
  noStroke();
  fill(255, 20, 0);
  for (let i = 0; i <= meterMaxIndex; i++) {
    if (meter[i]) {
      square(515, 400 - (30 * i), 30);
    }
  }
  pop();
}

function drawLiquidText() {
  text("Edible water pod, or plastic water bottle?");
}

// change individual fields of the clickables
function setupClickables() {
  // set the pop, inflate and deflate to be false, we will change this after
  // first balloon gets pressed
  clickables[inflateIndex].visible = false;
  clickables[deflateIndex].visible = false;

  // These are the CALLBACK functions. Right now, we do the SAME function for all of the clickables
  for (let i = 0; i < clickables.length; i++) {
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
  }
}

//--- CLICKABLE CALLBACK FUNCTIONS ----

clickableButtonPressed = function () {
  // Call newBalloon()
  if (this.id === yellowIndex || this.id === greenIndex) {
    newBalloon(this.id);
  }
  // Make user decide for liquid food
  else if (this.id === redIndex) {
    drawLiquidText();
  }

  // Decrement the danger meter
  else if (this.id === deflateIndex) {

    if (meterIndex > 0) {
      meter[meterIndex] = false;
      meterIndex = meterIndex - 1;
    }
  }

  // Increase the danger meter
  else if (this.id === inflateIndex) {

    if (meterIndex < meterMaxIndex) {
      meter[meterIndex] = true;
      meterIndex = meterIndex + 1;
    }
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#add8e6";
  this.noTint = false;
  this.tint = "#add8e6";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // Change colors based on the id #
  if (this.id === inflateIndex || this.id === deflateIndex) {
    this.color = "#FFFFFF";
  }
  else {
    this.color = "#AAAAAA";
  }

  this.noTint = true;
}

//--- BALLOON FUNCTIONS --

// when a new balloon is made, we show pop and inflate and deflate button,
// change fill color and reset ellipse diamter
function newBalloon(idNum) {
  clickables[inflateIndex].visible = true;
  clickables[deflateIndex].visible = true;

  if (idNum === redIndex) {
    textIndex = 0;
  }
  else if (idNum === greenIndex) {
    textIndex = 1;
  }
  else if (idNum === yellowIndex) {
    textIndex = 2;
  }

}

// if we pop the balloon, then you can't re-pop or inflate or deflate
function popBalloon() {
  popSound.play();

  ellipseDiameter = poppedEllipseDiameter;

  // balloon popped, hide these buttons
  clickables[inflateIndex].visible = false;
  clickables[deflateIndex].visible = false;
}


