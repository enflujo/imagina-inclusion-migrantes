<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import Sim from './Sim';
import type { DatosInclusion } from 'tipos/compartidos';
import { usarCerebroDatos } from '@/cerebros/datos';
import { generarBolas } from './utilidadesSimulacion';

const cerebroDatos = usarCerebroDatos();
const CANVAS_LENGTH = 580;

const lugarElegido: Ref<number> = ref(0);

watch(
  () => cerebroDatos.lugarSeleccionado,
  (nuevo) => {
    lugarElegido.value = nuevo;
    enNuevaSimulacion();
  }
);

const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const datos: Ref<DatosInclusion[]> = ref([]);
const empezar: Ref<HTMLButtonElement | null> = ref(null);
const detener: Ref<HTMLButtonElement | null> = ref(null);
const nuevo: Ref<HTMLButtonElement | null> = ref(null);

const contador: Ref<string> = ref('');
const infoPobVen: Ref<string> = ref('');

const ms = 30;
const dt = ms / 1000;
const sim: Ref<Sim | null> = ref(null);
let intervalo: number;
let intervaloActivo: boolean;

const activarIntervalo = () => {
  if (!intervaloActivo) {
    intervalo = window.setInterval(correrSimulacion, ms);
    intervaloActivo = true;
  }
};

const desactivarIntervalo = () => {
  window.clearInterval(intervalo);
  intervaloActivo = false;
};

const enNuevaSimulacion = () => {
  desactivarIntervalo();
  hacerSimulacion(100);
  contador.value = '';
  mostrarInfo();
};

onMounted(async () => {
  if (!lienzo.value) return;

  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  datos.value = cerebroDatos.datos;
  contexto.value = lienzo.value.getContext('2d');
  escalar();

  mostrarInfo();
  hacerSimulacion(100);

  empezar.value?.addEventListener('click', activarIntervalo);
  detener.value?.addEventListener('click', desactivarIntervalo);
  nuevo.value?.addEventListener('click', enNuevaSimulacion);
});

onUnmounted(() => {
  empezar.value?.removeEventListener('click', activarIntervalo);
  detener.value?.removeEventListener('click', desactivarIntervalo);
  nuevo.value?.removeEventListener('click', enNuevaSimulacion);
  window.clearInterval(intervalo);
});

function escalar() {
  if (!lienzo.value) return;
  const l = lienzo.value;
  l.width = CANVAS_LENGTH;
  l.height = CANVAS_LENGTH;
}

/**
 *
 * @param indiceLugar : índice del lugar
 * @param cantidadBolas: Cantidad de bolas que vamos a generar
 * @returns
 */
function hacerSimulacion(cantidadBolas: number) {
  const fuente = datos.value.find((obj) => obj.id === lugarElegido.value);
  if (!fuente) return;
  const cantidadMuros = 100 - fuente.valorIndice;
  const bolas = generarBolas(cantidadBolas, cantidadMuros, CANVAS_LENGTH);

  // Crear nueva simulación
  sim.value = new Sim(bolas, CANVAS_LENGTH, cantidadMuros);
  if (!contexto.value) return;
  sim.value.redibujar(contexto.value);
}

function correrSimulacion() {
  if (!contexto.value) return;

  const fuente = datos.value.find((obj) => obj.id === lugarElegido.value);
  if (!fuente) return;
  const indiceInclusion = Math.round(fuente.valorIndice);
  const simulador = sim.value;

  if (!contador || !simulador) return;
  contador.value = `${simulador.bolasCoronadas}`;

  // Detener la simulación cuando corone el número de bolas = al índice de inclusión
  if (simulador.bolasCoronadas >= indiceInclusion) {
    desactivarIntervalo();

    contador.value = `El índice de inclusión en ${fuente.nombre} es ${fuente.valorIndice.toFixed(2)}`;
  }

  simulador.redibujar(contexto.value);

  try {
    simulador.simulate(dt);
  } catch (e) {
    console.error(e);
    window.clearInterval(intervalo);
  }
}

function mostrarInfo() {
  const fuente = datos.value.find((obj) => obj.id === lugarElegido.value);
  if (!fuente) return;
  infoPobVen.value = `Según los datos en 2023 había ${fuente.pobVenMun.toLocaleString('en-US')} personas venezolanas en ${fuente.nombre} (población ${fuente.poblacionTotal?.toLocaleString('en-US')}), de las cuales el ${fuente.porcentRegularMun.toFixed(2)}% estaban regularizadas.`;
}
</script>

<template>
  <section id="contenedorSimulacion">
    <h2>Simulación</h2>

    <div id="infoLienzo">
      <p>{{ infoPobVen }}</p>
    </div>
    <canvas ref="lienzo"></canvas>

    <div id="botonesSimulacion">
      <button ref="empezar" id="empezar">Empezar</button>
      <button ref="detener" id="detener">Detener</button>
      <button ref="nuevo" id="nuevo">Nueva simulación</button>
      <div id="contador">{{ contador }}</div>
    </div>
  </section>
</template>

<style lang="scss">
#lienzo {
  margin-top: 20px;
}

#botonesSimulacion {
  text-align: center;
  margin-top: 20px;
}

#contador {
  border: solid 2px;
  padding: 0.5em;
  width: fit-content;
  margin: 1em auto;
}
</style>
