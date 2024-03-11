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
// /*
// 	Generar estados iniciales
// */
function validarNuevaBola(bolas: Bola[], ball: Bola) {
  if (
    ball.p.x - ball.r <= 0 ||
    ball.p.x + ball.r >= CANVAS_LENGTH ||
    ball.p.y - ball.r <= 0 ||
    ball.p.y + ball.r >= CANVAS_LENGTH
  ) {
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
  let m = 41; //debe ser impar. A menor número, mayor diámetro de los círculos del muro
  let h = CANVAS_LENGTH / m; // longitud del canvas / m
  const cantidadMuros = 50;
  // el valor que se suma a i define la distancia entre los círculos que forman el muro
  for (let i = 0; i < cantidadMuros; i++) {
    // if (i === Math.floor((m - 1) / 2) || i === Math.floor((m - 1) / 2) - 1) {
    //   continue;
    // }

    const x = Math.floor(Math.random() * (CANVAS_LENGTH * 0.6));
    const y = Math.floor(Math.random() * CANVAS_LENGTH);
    bolas.push(
      new Bola(
        x,
        // 0.5 * CANVAS_LENGTH, // distancia del borde izquierdo al muro
        //(h + 0.5) * (i - 5),
        y,
        0,
        0,
        h,
        200000,
        '#222',
        true
      )
    );
  }

  // Generar partículas
  let badBallCounter = 0;
  for (let i = 0; i < n; i++) {
    let newBall = new Bola(
      0.1 * Math.floor(Math.random() * CANVAS_LENGTH),
      Math.floor(Math.random() * CANVAS_LENGTH),
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
let bolas = [];

function hacerSimulacion() {
  bolas = generarBolas(100);
  // Crear nueva simulación
  sim = new Sim(bolas, CANVAS_LENGTH);
  if (!ctx) return;
  sim.redibujar(ctx);
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
  if (!ctx) return;
  sim.redibujar(ctx);
  try {
    sim.simulate(dt);
  } catch (e) {
    console.log(e);
    window.clearInterval(interval);
  }
}

hacerSimulacion();

const botonEmpezar = document.getElementById('empezar') as HTMLButtonElement;
const botonDetener = document.getElementById('detener') as HTMLButtonElement;
const botonNuevaSimulacion = document.getElementById('nuevo') as HTMLButtonElement;

botonEmpezar.addEventListener('click', activateInterval);

botonDetener.addEventListener('click', deactivateInterval);

botonNuevaSimulacion.addEventListener('click', () => {
  deactivateInterval();
  hacerSimulacion();
});
