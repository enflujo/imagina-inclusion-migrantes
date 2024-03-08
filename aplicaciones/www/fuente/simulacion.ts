import MinPQ from './FilaPrioritaria';
import SimEvent from './SimEvent';
import Bola from './Bola';
import Sim from './Sim';

/*
	Configurar canvas
*/
var CANVAS_LENGTH = 580;
var canvas = document.getElementById('canvas') as HTMLCanvasElement;
var ctx = canvas.getContext('2d');

if (canvas) {
  canvas.width = CANVAS_LENGTH;
  canvas.height = CANVAS_LENGTH;
  canvas.style.marginTop = '20px';
}

var diff = document.documentElement.clientHeight - CANVAS_LENGTH;
var cl = CANVAS_LENGTH;
// /*
// 	Generar estados iniciales
// */
var cl = CANVAS_LENGTH;
function validarNuevaBola(bolas: Bola[], ball: Bola) {
  if (ball.p.x - ball.r <= 0 || ball.p.x + ball.r >= cl || ball.p.y - ball.r <= 0 || ball.p.y + ball.r >= cl) {
    return false;
  }
  var dx;
  var dy;
  var r;
  for (var i = 0; i < bolas.length; i++) {
    dx = bolas[i].p.x - ball.p.x;
    dy = bolas[i].p.y - ball.p.y;
    r = bolas[i].r + ball.r;
    if (dx * dx + dy * dy <= r * r) {
      return false;
    }
  }
  return true;
}
function posNeg() {
  return Math.pow(-1, Math.floor(Math.random() * 2));
}

/**
 *
 * @param params {n: cantidad de partículas}
 * @returns
 */
function generarBolas(n: number) {
  /* Crear muro */
  let bolas = [];
  let m = 79; //debe ser impar. A menor número, mayor diámetro de los círculos del muro
  let h = cl / m; // longitud del canvas / m

  // el valor que se suma a i define la distancia entre los círculos que forman el muro
  for (let i = -1; i < m + 1; i += 2) {
    if (i === Math.floor((m - 1) / 2) || i === Math.floor((m - 1) / 2) - 1) {
      continue;
    }

    bolas.push(
      new Bola(
        0.5 * cl, // distancia del borde izquierdo al muro
        (h + 0.5) * (i - 5),
        0,
        0,
        h,
        200000
      )
    );
  }

  // Generar partículas
  let badBallCounter = 0;
  for (let i = 0; i < n; i++) {
    let newBall = new Bola(
      0.1 * Math.floor(Math.random() * cl),
      Math.floor(Math.random() * cl),
      posNeg() * Math.floor(Math.random() * 200), // El último número es la velocidad de las partículas
      posNeg() * Math.floor(Math.random() * 200),
      2, // Radio de las partículas. Tiene un límite
      0.00001
    );
    if (validarNuevaBola(bolas, newBall)) {
      bolas.push(newBall);
      badBallCounter = 0;
    } else {
      if (++badBallCounter > 99) {
        console.log('Too many bad balls in diffusion ball generator');
        return [];
      }
      i--;
    }
  }
  return bolas;
}

/*
	Correr simulación
*/
const ms = 30;
const dt = ms / 1000;
let sim: Sim;

function hacerSimulacion() {
  bolas = generarBolas(150);

  // Crear nueva simulación
  sim = new Sim(bolas, cl);
}

let interval: number, intervalActive: boolean;
function activateInterval() {
  if (!intervalActive) {
    interval = window.setInterval(correrSimulacion, ms);
    intervalActive = true;
  }
}
function deactivateInterval() {
  window.clearInterval(interval);
  intervalActive = false;
}

function correrSimulacion() {
  sim.redraw(ctx, cl);
  try {
    sim.simulate(dt, cl);
  } catch (e) {
    console.log(e);
    window.clearInterval(interval);
  }
}

let bolas = generarBolas(150);
hacerSimulacion();
sim = new Sim(bolas, cl);
//sim.redraw(ctx, cl);

const botonEmpezar = document.getElementById('empezar') as HTMLButtonElement;
const botonDetener = document.getElementById('detener') as HTMLButtonElement;
const botonNuevaSimulacion = document.getElementById('nuevo') as HTMLButtonElement;

botonEmpezar.addEventListener('click', activateInterval);

botonDetener.addEventListener('click', deactivateInterval);

botonNuevaSimulacion.addEventListener('click', () => {
  deactivateInterval();
  hacerSimulacion();
  sim.redraw(ctx, cl);
});
