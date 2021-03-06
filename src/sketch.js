// DECLARE GLOABAL VARIABLES
let steps, border, yOff, pause, showFlowfield, colored;
let particles = [];
let flowfield;

// DECLARE COLORS
let white, black, blue;

// DECLARE BUTTONS
let buttonPause, buttonResume, buttonClear, buttonToggleFlowfield, buttonRegenerateFlowfield, buttonToggleColored;

// DECLARE SLIDERS
let sliderMaxParticles, sliderSpeed;

// DECLARE CONSTANTS
const paperWidth = 800;
const paperHeight = 600;

function inititalizeGlobalVariables() {
  // steps = parseInt(random(10, 20));
  steps = 8;
  border = 40;
  yOff = 10;
  pause = false;
  showFlowfield = false;
  colored = false;

  flowfield = new Flowfield(steps, paperWidth, paperHeight);
  flowfield.generate();

  white = color(245);
  black = color(40);
  blue = color(80, 80, 220);
}

function setup() {
  inititalizeGlobalVariables();
  let div = createDiv().addClass('wrapper').size(paperWidth);
  createCanvas(paperWidth, paperHeight).parent(div).addClass('canvas');

  buttonRegenerateFlowfield = createButton("Regenerate Flowfield").addClass('button').parent(div);
  buttonRegenerateFlowfield.mouseClicked(() => { flowfield.generate(); particles = [] });

  buttonClear = createButton("Clear").addClass('button').parent(div);
  buttonClear.mouseClicked(() => { particles = [] });

  buttonPause = createButton("Pause").addClass('button').parent(div);
  buttonPause.mouseClicked(() => { pause = true });

  buttonResume = createButton("Resume").addClass('button').parent(div);
  buttonResume.mouseClicked(() => { pause = false });

  buttonToggleFlowfield = createButton("Toggle Flowfield").addClass('button').parent(div);
  buttonToggleFlowfield.mouseClicked(() => { showFlowfield = !showFlowfield });

  buttonToggleColored = createButton("Toggle Color").addClass('button').parent(div);
  buttonToggleColored.mouseClicked(() => {
    colored = !colored;
    particles.forEach(p => {
      p.colored = !p.colored;
    })
  });

  sliderMaxParticles = createSlider(1, 10000, 2000, 1).addClass('slider').parent(div);
  sliderSpeed = createSlider(1, 200, 20, 1).addClass('slider').parent(div);
}

function draw() {
  for (let speedUp = 0; speedUp < sliderSpeed.value(); ++speedUp) {
    background(black);

    // if (frameCount % 1 === 0)
    if (!pause) {
      if (particles.length >= sliderMaxParticles.value()) {
        particles.splice(0, particles.length - sliderMaxParticles.value());
      }
      particles.push(new Particle(random(border, paperWidth - border), random(border, paperHeight - border), border, flowfield, colored));
    }

    for (let i = 0; i < particles.length; ++i) {
      let p = particles[i];
      if (!pause)
        p.physics();
      p.removeLoose();
      if (p.removeFlag)
        particles.splice(i, 1);
    }
  }

  if (showFlowfield)
    flowfield.render("arrow");

  for (let i = 0; i < particles.length; ++i) {
    particles[i].render();
  }
  // noLoop();
}