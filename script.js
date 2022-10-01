let canvas;
let ctx;
let field;
let w, h;
let size;
let columns;
let rows;
let noiseZ;

let bright_bg = "#fff7ed";
let dark_bg = "black";
let bg = bright_bg;
let stroke="black";

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    bg=dark_bg;
    stroke="white";
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) { 
    if (stroke==="white"){
        bg=bright_bg;
        stroke="black";
    }
    else{
        bg=dark_bg;
        stroke="white";
    }
})

function setup() {
  size = 20;
  noiseZ = 0;
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  reset();
  window.addEventListener("resize", reset);
}

function initField() {
  field = new Array(columns);
  for (let x = 0; x < columns; x++) {
    field[x] = new Array(columns);
    for (let y = 0; y < rows; y++) {
      field[x][y] = [0, 0];
    }
  }
}

function calculateField() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let angle = noise.simplex3(x / 50, y / 50, noiseZ) * Math.PI * 2;
      let length = noise.simplex3(x / 50 + 40000, y / 50 + 40000, noiseZ);
      field[x][y][0] = angle;
      field[x][y][1] = Math.abs(length);
    }
  }
}

function reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  noise.seed(Math.random());
  columns = Math.floor(w / size) + 1;
  rows = Math.floor(h / size) + 1;
  initField();
}

function draw() {
  requestAnimationFrame(draw);
  calculateField();
  noiseZ += 0.003;
  clear();
  drawField();
}

function clear() {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

function drawField() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let angle = field[x][y][0];
      let length = field[x][y][1];
      ctx.save();
      ctx.translate(x * size, y * size);
      ctx.rotate(angle);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size * length + 10);
      ctx.translate(0, size * length + 10);
      ctx.rotate(2.37);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 10);
      ctx.moveTo(0, 0);
      ctx.rotate(-4.74);
      ctx.lineTo(0, 10);
      ctx.stroke();
      ctx.restore();
    }
  }
}

setup();
draw();
