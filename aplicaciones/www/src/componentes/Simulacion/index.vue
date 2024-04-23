<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref, computed } from 'vue';
import Sim from './Sim';
import type { DatosInclusion } from 'tipos/compartidos';
import { usarCerebroDatos } from '@/cerebros/datos';
import { generarBolas } from './utilidadesSimulacion';

interface Esquema {
  idLugar: number;
}
const props = defineProps<Esquema>();

const cerebroDatos = usarCerebroDatos();
const contenedor: Ref<HTMLElement | null> = ref(null);
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const datos: Ref<DatosInclusion[]> = ref([]);
const fuente = computed(() => datos.value.find((obj) => obj.id === props.idLugar));

const nombreLugar: Ref<string> = ref('');
const contador: Ref<string> = ref('');
const infoPobVen: Ref<string> = ref('');
const anchoLienzo: Ref<number> = ref(500);

const ms = 30;
const dt = ms / 1000;
const sim: Ref<Sim | null> = ref(null);
let intervalo: number = 0;

const activarIntervalo = () => {
  if (!intervalo) {
    intervalo = window.setInterval(correrSimulacion, ms);
  }
};

const desactivarIntervalo = () => {
  window.clearInterval(intervalo);
  intervalo = 0;
};

onMounted(async () => {
  if (!lienzo.value) return;

  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  datos.value = cerebroDatos.datos;

  contexto.value = lienzo.value.getContext('2d');
  escalar();
  iniciarSimulacion();
});

onUnmounted(() => {
  window.clearInterval(intervalo);
});

function iniciarSimulacion() {
  desactivarIntervalo();
  hacerSimulacion(100);
  contador.value = '';
  mostrarInfo();
  activarIntervalo();
}

function escalar() {
  let anchoSeccion = contenedor.value?.clientWidth;
  if (!lienzo.value || !anchoSeccion) return;
  lienzo.value.width = anchoSeccion;
  lienzo.value.height = anchoSeccion / 4;
  anchoLienzo.value = anchoSeccion;
}

/**
 *
 * @param indiceLugar : índice del lugar
 * @param cantidadBolas: Cantidad de bolas que vamos a generar
 * @returns
 */
function hacerSimulacion(cantidadBolas: number) {
  const datosLugar = fuente.value;
  const dimLienzo = anchoLienzo.value;
  if (!datosLugar) return;
  const cantidadMuros = 100 - datosLugar.valorIndice;
  const bolas = generarBolas(cantidadBolas, cantidadMuros, dimLienzo);

  // Crear nueva simulación
  if (!lienzo.value) return;
  sim.value = new Sim(bolas, lienzo.value.width, lienzo.value.height, cantidadMuros);
  if (!contexto.value) return;
  sim.value.redibujar(contexto.value);
}

function correrSimulacion() {
  if (!contexto.value) return;

  const datosLugar = fuente.value;
  if (!datosLugar) return;
  const indiceInclusion = Math.round(datosLugar.valorIndice);
  const simulador = sim.value;

  if (!contador || !simulador) return;
  contador.value = `${simulador.bolasCoronadas}`;

  // Detener la simulación cuando corone el número de bolas = al índice de inclusión
  if (simulador.bolasCoronadas >= indiceInclusion) {
    desactivarIntervalo();
    contador.value = `El índice de inclusión en ${datosLugar.nombre} es ${datosLugar.valorIndice.toFixed(2)}`;
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
  const datosLugar = fuente.value;
  if (!datosLugar) return;
  nombreLugar.value = `${datosLugar.nombre}, ${datosLugar.dep}`;
  infoPobVen.value = `Según los datos, en 2023 había ${datosLugar.pobVenMun.toLocaleString('en-US')} personas venezolanas en ${datosLugar.nombre}, ${datosLugar.dep} (población ${datosLugar.poblacionTotal?.toLocaleString('en-US')}), de las cuales el ${datosLugar.porcentRegularMun.toFixed(2)}% estaban regularizadas.`;
}
</script>

<template>
  <section ref="contenedor">
    <div class="infoSimulacion">
      <h2 @click="quitarLugar($event)">{{ nombreLugar }}</h2>
      <p>{{ infoPobVen }}</p>
    </div>

    <canvas class="lienzoSim" ref="lienzo"></canvas>

    <div class="botonesSimulacion">
      <div class="contador">{{ contador }}</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.infoSimulacion {
  padding: 0 20px;
}

.lienzoSim {
  border: 1px solid #7d7979;
}

.contador {
  border: solid 2px;
  padding: 0.5em;
  width: fit-content;
  margin: 1em auto;
}
</style>
