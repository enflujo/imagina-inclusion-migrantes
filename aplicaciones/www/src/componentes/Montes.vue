<script setup lang="ts">
import type { PasosEscalera } from '@/tipos';
import { convertirEscala } from '@enflujo/alquimia';
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';
import InfoMonte from './InfoMonte.vue';

interface Esquema {
  porcentajesC: PasosEscalera;
  porcentajesV: PasosEscalera;
  irASeccion: (i: number) => void;
}

const props = defineProps<Esquema>();
const grafica: Ref<(HTMLElement & SVGElement) | undefined> = ref();
const lineaV = ref('');
const lineaC = ref('');
const numeroSecciones = ref(0);
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
const posY = (valor: number) => convertirEscala(valor, 0, 100, 10, dims.value.piso);

const nombresSecciones = [
  'Mujeres Embarazadas',
  'Regularizadas',
  'Afiliadas al sistema de salud',
  'Con 4 controles prenatales',
];
const margenX = 100;

onMounted(() => {
  numeroSecciones.value = props.porcentajesV.length;
  escalar();
  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  window.removeEventListener('resize', escalar);
});

function pintarLinea(datos: PasosEscalera) {
  if (!grafica.value) return '';
  const secciones = numeroSecciones.value;
  const { ancho, anchoSeccion, centroMonte, piso } = dims.value;
  /** La inclinación debe ser 3 o más: números bajitos para hacer las montañas más empinadas, número alto para hacer las montañas menos empinadas (más gorditas) */
  const inclinacion = 6;
  const margenXSeccion = anchoSeccion / inclinacion;
  const punto0 = { x: 0, y: piso };
  let x = punto0.x;
  let linea = `M 0 0 0 ${piso} ${x + margenX} ${punto0.y} ${margenX} ${punto0.y} `;

  x = margenX;

  for (let i = 0; i < secciones; i++) {
    linea += `${x + margenXSeccion} ${piso} ${x + centroMonte} ${posY(datos[i])} ${x + anchoSeccion - margenXSeccion} ${piso} `;
    x += anchoSeccion;
  }

  linea += `${margenX + ancho} ${piso} 0 ${piso}`;

  return linea;
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

    dims.value = {
      anchoTotal: ancho,
      altoTotal: alto,
      piso: alto - margenY,
      techo: margenY,
      ancho: anchoGrafica,
      alto: alto - margenY * 2,
      anchoSeccion,
      centroMonte: anchoSeccion / 2,
    };

    lineaV.value = pintarLinea(props.porcentajesV);
    lineaC.value = pintarLinea(props.porcentajesC);
  }
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
</template>

<style lang="scss" scoped>
.montes {
  // border: 1px solid;
  height: 50vh;
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

//rgba(255, 169, 172, 0.379), rgba(208, 238, 223, 0.68)
</style>
