<script setup lang="ts">
import { datosLinea, fechaFinal, fechaInicial, numeroMax, numeroMin } from '@/cerebros/lineaTiempo';
import type { MomentoLinea } from '@/tipos';
import { formatoNumero } from '@/utilidades/ayudas';
import { convertirEscala } from '@enflujo/alquimia';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

const grafica: Ref<(HTMLElement & SVGElement) | undefined> = ref();
const margenX = 20;
const margenY = 20;
const dims = ref({ anchoTotal: 0, altoTotal: 0, ancho: 0, alto: 0, techo: 0, piso: 0 });
const infoVisible = ref(false);
const infoX = ref(0);
const infoY = ref(0);
const textoInfo = ref('');
const textoAño = ref('');
const textoNumero = ref('');
const posY = (valor: number) => convertirEscala(valor, numeroMin, numeroMax, dims.value.techo, dims.value.piso);
const posX = (valor: number) => convertirEscala(valor, fechaInicial, fechaFinal, margenX, dims.value.ancho);
const radio = (valor: number) => convertirEscala(valor, numeroMin, numeroMax, 5, 25);

onMounted(() => {
  escalar();
  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  window.removeEventListener('resize', escalar);
});

function escalar() {
  if (!grafica.value) return;
  const svg = grafica.value;
  const contenedor = svg.parentElement;

  if (contenedor) {
    const anchoTotal = contenedor.clientWidth;
    const altoTotal = svg.clientHeight;
    const ancho = anchoTotal - margenX * 2;
    const alto = altoTotal - margenY * 2;
    svg.setAttribute('width', `${anchoTotal}`);
    svg.setAttribute('height', `${altoTotal}`);
    Object.assign(dims.value, {
      ancho,
      alto,
      piso: alto - margenY,
      techo: margenY,
    });
  }
}

function mostrarInfo(punto: MomentoLinea) {
  infoVisible.value = true;
  textoInfo.value = punto.texto;
  textoAño.value = `${punto.año}`;
  textoNumero.value = formatoNumero.format(punto.numero);
}

function esconderInfo() {
  infoVisible.value = false;
}

function actualizarPosicion(evento: MouseEventInit) {
  const { clientX, clientY } = evento;
  if (clientX && clientY) {
    infoX.value = clientX;
    infoY.value = clientY;
  }
}

console.log(datosLinea);
</script>

<template>
  <svg class="lineaTiempo" ref="grafica" @mousemove="actualizarPosicion">
    <g
      v-for="punto in datosLinea"
      class="punto"
      :style="{ transform: `translate(${posX(punto.año)}px, ${posY(punto.numero)}px)` }"
      @mouseenter="mostrarInfo(punto)"
      @mouseleave="esconderInfo"
    >
      <circle :class="`circulo ${punto.clase || ''}`" x="0" y="0" :r="radio(punto.numero)" />
      <text class="año" x="-12" :y="`-${radio(punto.numero) + 3}`">{{ punto.año }}</text>
    </g>
  </svg>

  <div :class="`info${infoVisible ? ' visible' : ''}`" :style="{ left: `${infoX}px`, top: `${infoY}px` }">
    <p class="textoInfo">En {{ textoAño }} {{ textoInfo }}</p>
    <p class="textoAño">
      <span class="resaltar">{{ textoNumero }}</span> Venezolanos viven en Colombia
    </p>
  </div>
</template>

<style lang="scss" scoped>
.lineaTiempo {
  height: 35vh;
}

.punto {
  cursor: pointer;
}

.circulo {
  fill: rgb(202, 96, 223);
  filter: drop-shadow(0 0 0.55rem rgba(0, 0, 0, 0.2));

  &.acento {
    stroke: rgb(1, 2, 2);
    stroke-width: 0.5;
    fill: rgb(70, 202, 129);
    // stroke-dasharray: 3;
    animation: 2s infinite alternate acento;
  }

  &.extremo {
    stroke: rgb(13, 15, 14);
    stroke-width: 2;
    stroke-dasharray: 2;
  }
}
.año {
  font-size: 0.65em;
  // transform: translate(-1em, 40px);
}

.resaltar {
  font-weight: bold;
}

.info {
  width: 200px;
  min-height: 100px;
  border: 1px solid;
  background-color: rgba(241, 235, 235, 0.9);
  position: absolute;
  transform: translate(15px, -30%);
  display: none;
  font-size: 0.75em;
  padding: 0.5em;
  z-index: 999;

  &.visible {
    display: block;
  }
}

@keyframes acento {
  from {
    filter: drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.5));
  }

  to {
    filter: drop-shadow(0 0 0.75rem rgb(0, 0, 0, 0.8));
  }
}
</style>
