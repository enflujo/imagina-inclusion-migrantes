<script setup lang="ts">
import { datosLinea, fechaFinal, fechaInicial, numeroMax, numeroMin } from '@/cerebros/lineaTiempo';
import type { MomentoLinea } from '@/tipos';
import { formatoNumero } from '@/utilidades/ayudas';
import { convertirEscala } from '@enflujo/alquimia';
import { onMounted, onUnmounted, onUpdated, ref, useTemplateRef, type Ref } from 'vue';

interface Props {
  mostrar: boolean;
}

const props = defineProps<Props>();
const puntos = useTemplateRef<SVGGElement[]>('puntos');
const datos = ref(datosLinea);

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
const posX = (valor: number) =>
  convertirEscala(valor, fechaInicial, fechaFinal, margenX, dims.value.ancho - margenX - 100);
const radio = (valor: number) => convertirEscala(valor, numeroMin, numeroMax, 5, 25);

onMounted(() => {
  escalar();
  window.addEventListener('resize', escalar);
});

onUpdated(() => {
  if (props.mostrar) {
    puntos.value?.forEach((punto, i) => {
      punto.classList.add('animar');
      punto.style.transform = `translate(${posX(datosLinea[i].año)}px, ${dims.value.piso}px)`;
    });
  } else {
    reiniciar();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', escalar);
});

function reiniciar() {
  puntos.value?.forEach((punto) => {
    punto.classList.remove('animar');
    punto.style.transform = `translate(-100px, ${dims.value.piso}px)`;
  });
}

function escalar() {
  if (!grafica.value) return;
  const svg = grafica.value;
  const contenedor = svg.parentElement;

  if (contenedor) {
    const anchoTotal = contenedor.clientWidth;
    const altoTotal = svg.clientHeight;
    const ancho = anchoTotal - margenX * 2;
    const alto = altoTotal - margenY * 2;
    const piso = alto - margenY;
    svg.setAttribute('width', `${anchoTotal}`);
    svg.setAttribute('height', `${altoTotal}`);

    puntos.value?.forEach((punto) => (punto.style.transform = `translateY(${piso}px)`));

    Object.assign(dims.value, {
      ancho,
      alto,
      piso,
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
</script>

<template>
  <svg class="lineaTiempo" ref="grafica" @mousemove="actualizarPosicion">
    <g
      v-for="punto in datos"
      class="punto"
      ref="puntos"
      @mouseenter="mostrarInfo(punto)"
      @mouseleave="esconderInfo"
      style="transform: translate(-100px, 100px)"
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
  height: 150px;
  position: relative;
}

.punto {
  cursor: pointer;
  opacity: 0;
  transition:
    transform 3.45s ease-in-out,
    opacity 0.4s ease-out;

  &.animar {
    opacity: 1;
  }
}

.circulo {
  fill: rgb(202, 96, 223);
  filter: drop-shadow(0 0 0.55rem rgba(0, 0, 0, 0.2));

  &.acento {
    stroke: rgb(1, 2, 2);
    stroke-width: 0.5;
    fill: rgb(70, 202, 129);
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
}

.resaltar {
  font-weight: bold;
}

.info {
  width: 200px;
  min-height: 100px;
  border: 1px solid;
  background-color: rgba(241, 235, 235, 0.9);
  position: fixed;
  transform: translate(10px, -50%);
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
