<script setup lang="ts">
import type { PasosEscalera } from '@/tipos';
import { convertirEscala } from '@enflujo/alquimia';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import InfoMonte from './InfoMonte.vue';
import Particula from './Particula';

interface Esquema {
  irASeccion: (i: number) => void;
}

defineProps<Esquema>();
const grafica: Ref<(HTMLElement & SVGElement) | undefined> = ref();
const lineaV = ref('');
const lineaC = ref('');
const numeroSecciones = ref(0);
const margenX = 100;
const dims = ref({
  anchoTotal: 0,
  altoTotal: 0,
  ancho: 0,
  alto: 0,
  piso: 0,
  techo: 0,
  anchoSeccion: 0,
  centroMonte: 0,
});
const mujeres: Particula[] = [];
const mujer = ref();
let particula: Particula;

const posY = (valor: number) => convertirEscala(valor, 0, 100, 10, dims.value.piso);

const datosControlesV: PasosEscalera = [76599, 63306, 39883, 26243];
const porcentajesV = datosControlesV.map((valor) => +((valor / datosControlesV[0]) * 100).toFixed(2)) as PasosEscalera;
let reloj = 0;
/** 
 * Según el Plan Decenal de Salud el 95 % de las mujeres gestantes debe tener cuatro o más controles prenatales.
Según la meta de los Objetivos de Desarrollo Sostenible (ODS), para el 2030, el 93 % de las gestantes debe tener cuatro o más controles prenatales
 */
const umbralPlanDecenal = 95;
const umbralODS = 93;

const datosControlesC: PasosEscalera = [623715, 623715, 623715, 503715];
const porcentajesC = datosControlesC.map((valor) => +((valor / datosControlesC[0]) * 100).toFixed(2)) as PasosEscalera;
const porcentajesIdeal = [100, 100, 100, umbralPlanDecenal];

const nombresSecciones = [
  'Mujeres Embarazadas',
  'Regularizadas',
  'Afiliadas al sistema de salud',
  'Con 4 controles prenatales',
];

onMounted(() => {
  numeroSecciones.value = porcentajesV.length;
  escalar();
  reloj = requestAnimationFrame(animar);
  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  cancelAnimationFrame(reloj);
  window.removeEventListener('resize', escalar);
});

function construirLinea(datos: PasosEscalera) {
  if (!grafica.value) return;
  const secciones = numeroSecciones.value;
  const { ancho, anchoSeccion, centroMonte, piso } = dims.value;
  /** La inclinación debe ser 3 o más: números bajitos para hacer las montañas más empinadas, número alto para hacer las montañas menos empinadas (más gorditas) */
  const inclinacion = 6;
  const margenXSeccion = anchoSeccion / inclinacion;
  const punto0 = { x: 0, y: piso };
  let x = punto0.x;

  // esquina superior izquierda
  let linea = `M 0 0 0 ${piso} `;
  // izquierda y piso: punto de inicio
  linea += `${x + margenX} ${punto0.y} `;

  const datosLinea: [x: number, y: number][] = [];
  x = margenX;

  for (let i = 0; i < secciones; i++) {
    const x1 = x + margenXSeccion;
    const x2 = x + centroMonte;
    const y2 = posY(datos[i]);
    const x3 = x + anchoSeccion - margenXSeccion;
    linea += `${x1} ${piso} ${x2} ${y2} ${x3} ${piso} `;
    datosLinea.push([x1, piso], [x2, y2], [x3, piso]);
    x += anchoSeccion;
  }

  linea += `${margenX + ancho} ${piso} 0 ${piso}`;
  datosLinea.push([margenX + ancho, piso]);
  return { linea, datos: datosLinea };
}

function escalar() {
  if (!grafica.value) return;
  const svg = grafica.value;
  const contenedor = svg.parentElement;

  if (contenedor) {
    const { clientWidth: ancho, clientHeight: alto } = contenedor;
    svg.setAttribute('width', `${ancho}`);
    svg.setAttribute('height', `${alto}`);

    const anchoGrafica = ancho - margenX * 2;
    const anchoSeccion = anchoGrafica / numeroSecciones.value;
    const margenY = 50;
    const piso = alto - margenY;
    dims.value = {
      anchoTotal: ancho,
      altoTotal: alto,
      piso,
      techo: margenY,
      ancho: anchoGrafica,
      alto: piso * 2,
      anchoSeccion,
      centroMonte: anchoSeccion / 2,
    };

    const venezolanas = construirLinea(porcentajesV);
    const colombianas = construirLinea(porcentajesC);

    if (venezolanas) {
      lineaV.value = venezolanas.linea;

      if (!particula) {
        particula = new Particula(margenX, piso, 4, [margenX, piso], [ancho - margenX, piso], venezolanas.datos);
      } else {
        particula.actualizarPosiciones(margenX, piso, [margenX, piso], [ancho - margenX, piso]);
      }
    }

    lineaC.value = colombianas ? colombianas.linea : '';
  }
}

function animar() {
  if (!mujer.value) return;

  Object.assign(mujer.value.style, {
    left: `${particula.x}px`,
    top: `${particula.y}px`,
    transform: `translate(10px, -30px) rotate(${particula.angulo}rad)`,
  });

  particula.mover();
  reloj = requestAnimationFrame(animar);
}
</script>

<template>
  <svg class="montes" ref="grafica">
    <defs>
      <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
        <stop offset="30%" stop-color="rgb(244, 126, 130)" />
        <stop offset="100%" stop-color="rgb(162, 232, 197)" />
      </linearGradient>
    </defs>

    <g
      v-for="i in numeroSecciones"
      class="areaEscalon"
      :style="{ transform: `translate(${margenX + dims.anchoSeccion * (i - 1)}px, 0)` }"
      @click="irASeccion(i - 1)"
    >
      <rect class="zona" :x="0" y="0" :width="`${dims.anchoSeccion}px`" height="100%" />
      <text x="10px" y="20px">{{ nombresSecciones[i - 1] }}</text>
    </g>

    <g style="transform: translate(10px, -20px)">
      <text class="nombreGrupo" x="10px" :y="`${dims.piso - 3}px`">Venezolanas</text>
      <InfoMonte :dims="dims" :margenX="margenX" :porcentajes="porcentajesV" :linea="lineaV" :pos-y="posY" />
      <path v-if="lineaV.length" class="lineaRecorrido" :d="lineaV" fill="url(#color)"></path>
    </g>

    <g style="transform: translate(0, 0)">
      <text class="nombreGrupo" x="10px" :y="`${dims.piso - 3}px`">Colombianas</text>
      <!-- <InfoMonte :dims="dims" :margenX="margenX" :porcentajes="porcentajesC" :linea="lineaV" :pos-y="posY" /> -->
      <path v-if="lineaC.length" class="lineaRecorrido" :d="lineaC" fill="url(#color)"></path>
    </g>
  </svg>
  <span id="mujer" ref="mujer"></span>
</template>

<style lang="scss" scoped>
.montes {
  // border: 1px solid;
  height: 50vh;
}
#mujer {
  width: 4px;
  height: 10px;
  display: inline-block;
  background-color: green;
  position: absolute;
  // transform: translateY(-100%);
}
.lineaRecorrido {
  stroke: rgba(33, 24, 33, 0.5);
  stroke-width: 0.5;
  height: 150px;
  background: linear-gradient(to right, rgb(244, 126, 130), rgb(162, 232, 197) 100%);
  // fill: rgb(183, 0, 255);
}

.nombreGrupo {
  font-size: 0.85em;
}

.areaEscalon {
  cursor: pointer;

  .zona {
    fill: rgba(241, 241, 240, 0.31);
    stroke: black;
    stroke-width: 0.1;
  }

  &:hover {
    .zona {
      fill: rgba(241, 241, 240, 1);
    }
  }
}
</style>
