import Bola from './Bola';
import Sim from './Sim';

import { pedirDatos } from './utilidades/ayudas';
import { DatosInclusion } from '../../../tipos/compartidos';

const datos = await pedirDatos<DatosInclusion[]>('/inclusion-municipios.json');

/*
	Configurar canvas
*/
let CANVAS_LENGTH = 580;
let canvas = document.getElementById('simulacion') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');
let contador = document.getElementById('contador');
const indiceLugar = 800;
if (canvas) {
  canvas.width = CANVAS_LENGTH;
  canvas.height = CANVAS_LENGTH;
  canvas.style.marginTop = '20px';
}

let diff = document.documentElement.clientHeight - CANVAS_LENGTH;
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
  let dx;
  let dy;
  let r;
  for (let i = 0; i < bolas.length; i++) {
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
function generarBolas(cantidadBolas: number, cantidadMuros: number) {
  /* Crear muro */
  let bolas = [];
  let m = 41; //debe ser impar. A menor número, mayor diámetro de los círculos del muro
  let h = CANVAS_LENGTH / m; // longitud del canvas / m
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
  for (let i = 0; i < cantidadBolas; i++) {
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

// Definir número de muros según los datos -> Pensar mejor...
const numeroMuros = Math.ceil(100 - datos[indiceLugar].valorIndice);

// Definir lugar elegido
const lugarElegido = 0;

export default async function hacerSimulacion(cantidadBolas: number, cantidadMuros: number) {
  const bolas = generarBolas(cantidadBolas, cantidadMuros);

  // Crear nueva simulación
  sim = new Sim(bolas, CANVAS_LENGTH, cantidadMuros);
  if (!ctx) return;
  sim.redibujar(ctx);
}

let intervalo: number;
let intervaloActivo: boolean;

function activarIntervalo() {
  if (!intervaloActivo) {
    intervalo = window.setInterval(correrSimulacion, ms);
    intervaloActivo = true;
  }
}

function desactivarIntervalo() {
  window.clearInterval(intervalo);
  intervaloActivo = false;
}

function correrSimulacion() {
  if (!ctx) return;

  const indiceInclusion = Math.round(datos[indiceLugar].valorIndice);

  if (!contador) return;

  contador.innerText = `${sim.bolasCoronadas}`;

  // Detener la simulación cuando corone el número de bolas = al índice de inclusión
  if (sim.bolasCoronadas >= indiceInclusion) {
    desactivarIntervalo();
    contador.innerText = `El índice de inclusión en ${datos[indiceLugar].nombre} es ${datos[indiceLugar].valorIndice}`;
    console.log(`bolas coronadas: ${datos[lugarElegido].valorIndice}`);
  }

  sim.redibujar(ctx);
  try {
    sim.simulate(dt);
  } catch (e) {
    console.log(e);
    window.clearInterval(intervalo);
  }
}

hacerSimulacion(100, 100 - datos[indiceLugar].valorIndice);

const botonEmpezar = document.getElementById('empezar') as HTMLButtonElement;
const botonDetener = document.getElementById('detener') as HTMLButtonElement;
const botonNuevaSimulacion = document.getElementById('nuevo') as HTMLButtonElement;

botonEmpezar.addEventListener('click', activarIntervalo);

botonDetener.addEventListener('click', desactivarIntervalo);

botonNuevaSimulacion.addEventListener('click', () => {
  if (!contador) return;

  desactivarIntervalo();
  hacerSimulacion(100, 100 - datos[indiceLugar].valorIndice);
});
