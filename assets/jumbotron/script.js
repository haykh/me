const jumbotron_s = (sketch) => {
  var dT = 2;
  var PRTLRADIUS = 4;

  var BGCOLOR = "#2f2f2f";
  var GRIDSECCOLOR = "#4A4A4A";
  var GRIDCOLOR = "#363636";

  var particles = [];
  var NPARTICLES = 100;

  var time = 0, delta_time = 0.002;
  var ITER = 0;

  var positiveColor = '#db3340';
  var negativeColor = '#28abe3';

  var dS = 20;

  var width, height;
  var canvasDiv, canvas;

  sketch.setup = () => {
    sketch.frameRate(30);
    canvasDiv = document.getElementsByClassName('overlay')[0];
    width = canvasDiv.clientWidth;
    height = canvasDiv.clientHeight;
    canvas = sketch.createCanvas(width, height);
    canvas.id('jumbotron-canvas')
    canvas.parent(canvasDiv);
    for (let n = 0; n < NPARTICLES; ++n) {
      particles.push(new Particle());
    }
  }

  sketch.draw = () => {
    drawGrid();
    particles.forEach(prtl => {
      prtl.update();
      prtl.move();
      prtl.draw();
    });
    time += delta_time;
  }

  sketch.windowResized = () => {
    width = canvasDiv.clientWidth;
    height = canvasDiv.clientHeight;
    sketch.resizeCanvas(width, height);
  }

  class Particle {
    constructor() {
      this.reset();
    }
    move() {
      this.x += this.vx * dT;
      this.y += this.vy * dT;
      if ((this.x > width) || (this.x <= 0) || (this.y > height) || (this.y <= 0)) {
        this.reset();
      }
    }
    reset() {
      this.sign = sketch.random([-1, 1]);
      this.color = sketch.random([sketch.color(positiveColor), sketch.color(negativeColor)]);
      this.color.setAlpha(50);
      this.x = sketch.random(0, width);
      this.y = sketch.random(0, height);
    }
    update() {
      let ang = getNoiseValue(this.x, this.y) * 2 * Math.PI;
      let v = p5.Vector.fromAngle(ang, 1);
      this.vx = v.x * this.sign;
      this.vy = v.y * this.sign;
    }
    draw() {
      let xi = ~~(this.x / dS);
      let yi = ~~(this.y / dS);
      let opac = 1.0 - sketch.dist(this.x, this.y, (xi + 0.5) * dS, (yi + 0.5) * dS) / dS;
      let color = this.color;
      color.setAlpha(~~(opac * 200));
      sketch.noStroke();
      sketch.fill(color);
      sketch.rect(xi * dS, yi * dS, dS, dS)

      sketch.noStroke();
      sketch.fill(this.color);
      sketch.ellipseMode(sketch.CENTER);
      sketch.circle(~~this.x, ~~this.y, 2*PRTLRADIUS);
    }
  }

  function drawGrid() {
    sketch.background(BGCOLOR);
    dx = dS;
    dy = dx;
    sketch.stroke(sketch.color(GRIDCOLOR));
    for (let i = 0; i <= width / dx; ++i) {
      sketch.line(i * dx, 0, i * dx, height);
      if (i % 5 == 0) {
        sketch.stroke(sketch.color(GRIDSECCOLOR));
        sketch.line(i * dx, 0, i * dx, height);
        sketch.stroke(sketch.color(GRIDCOLOR));
      }
    }
    for (let j = 0; j <= height / dy; ++j) {
      sketch.line(0, j * dy, width, j * dy);
      if (j % 5 == 0) {
        sketch.stroke(sketch.color(GRIDSECCOLOR));
        sketch.line(0, j * dy, width, j * dy);
        sketch.stroke(sketch.color(GRIDCOLOR));
      }
    }
    // sketch.stroke(sketch.color(GRIDSECCOLOR));
    // drawVectorField(dS);
  }

  function drawVectorField(dS) {
    for (let i = 0; i < width / dS; ++i) {
      for (let j = 0; j < height / dS; ++j) {
        let xc = (i + 0.5) * dS;
        let yc = (j + 0.5) * dS;
        let noiseVal = getNoiseValue(xc, yc);
        let angle = noiseVal * Math.PI * 2;
        let v = p5.Vector.fromAngle(angle, dS / 2);
        // rect(i * dS, j * dS, (i + 1) * dS, (j + 1) * dS);
        sketch.line(xc, yc, xc + v.x, yc + v.y);
        sketch.line(xc, yc, xc - v.x, yc - v.y)
      }
    }
  }

  function getNoiseValue(x, y, scale=0.002) {
    return noise(x * scale, y * scale, time);
  }
}

let myp5_jumbotron = new p5(jumbotron_s);
