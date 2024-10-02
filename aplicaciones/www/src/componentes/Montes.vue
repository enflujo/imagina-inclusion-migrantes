<script setup lang="ts">
import type { PasosEscalera } from '@/tipos';
import { convertirEscala } from '@enflujo/alquimia';
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';

interface Esquema {
  porcentajesC: PasosEscalera;
  porcentajeV: PasosEscalera;
  irASeccion: (i: number) => void;
}

const props = defineProps<Esquema>();
const grafica: Ref<(HTMLElement & SVGElement) | undefined> = ref();
const lineaV = ref('');
const lineaC = ref('');
const numeroSecciones = ref(0);
const dims = ref({ anchoTotal: 0, altoTotal: 0, ancho: 0, alto: 0, piso: 0, anchoSeccion: 0 });

const nombresSecciones = [
  'Embarazadas',
  'Regularizadas',
  'Afiliadas al sistema de salud',
  'Con 4 o más controles prenatales',
];
const margenX = 100;

onMounted(() => {
  numeroSecciones.value = props.porcentajeV.length;
  escalar();

  lineaV.value = pintarLinea(props.porcentajeV);
  lineaC.value = pintarLinea(props.porcentajesC);
  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  window.removeEventListener('resize', escalar);
});

function pintarLinea(datos: PasosEscalera) {
  if (!grafica.value) return '';
  console.log(dims.value);
  const secciones = numeroSecciones.value;
  const { ancho, anchoSeccion, piso } = dims.value;
  const puntoY = (valor: number) => convertirEscala(valor, 0, 100, 10, piso);
  const mitadSeccion = anchoSeccion / 2;
  const margenXSeccion = anchoSeccion / 6;
  const punto0 = { x: 0, y: piso };
  let x = punto0.x;
  let linea = `M 0 0 0 ${piso} ${x + margenX} ${punto0.y} ${margenX} ${punto0.y} `;

  x = margenX;

  for (let i = 0; i < secciones; i++) {
    linea += `${x + margenXSeccion} ${piso} ${x + mitadSeccion} ${puntoY(datos[i])} ${x + anchoSeccion - margenXSeccion} ${piso} `;
    x += anchoSeccion;
  }

  linea += `${margenX + ancho} ${piso} 0 ${piso}`;

  return linea;
}

function escalar() {
  if (!grafica.value) return;
  const contenedor = grafica.value.parentElement;

  if (contenedor) {
    const { clientWidth: ancho, clientHeight: alto } = contenedor;
    grafica.value.setAttribute('width', `${ancho}`);
    grafica.value.setAttribute('height', `${alto}`);

    const anchoGrafica = ancho - margenX * 2;

    dims.value = {
      anchoTotal: ancho,
      altoTotal: alto,
      piso: alto - 10,
      ancho: anchoGrafica,
      alto: 0,
      anchoSeccion: anchoGrafica / numeroSecciones.value,
    };
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
      :style="{ transform: `translate(${margenX + dims.anchoSeccion * (i - 1)}px, 0)` }"
      @mouseenter="irASeccion(i - 1)"
    >
      <rect class="zona" :x="0" y="0" :width="`${dims.anchoSeccion}px`" height="100%" />
      <text x="10px" y="20px">{{ nombresSecciones[i - 1] }}</text>
    </g>

    <g style="transform: translate(0px, -10px)">
      <path v-if="lineaV.length" class="lineaRecorrido" :d="lineaV" fill="url(#color)"></path>
    </g>

    <g style="transform: translate(0, 0)">
      <path v-if="lineaC.length" class="lineaRecorrido" :d="lineaC" fill="url(#color)"></path>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.montes {
  border: 1px solid;
  height: 50vh;
}
.zona {
  fill: transparent;
  stroke: black;
  stroke-width: 0.1;
  fill: rgba(241, 241, 240, 0.31);
}
//rgba(255, 169, 172, 0.379), rgba(208, 238, 223, 0.68)
.lineaRecorrido {
  stroke: rgb(33, 24, 33);
  stroke-width: 0.1;
  height: 150px;
  background: linear-gradient(to right, rgb(244, 126, 130), rgb(162, 232, 197) 100%);
  // fill: rgb(183, 0, 255);
}
</style>
