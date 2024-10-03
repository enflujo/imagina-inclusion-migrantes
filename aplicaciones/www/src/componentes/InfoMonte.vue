<script setup lang="ts">
import type { DimsGraficaMonte, PasosEscalera } from '@/tipos';

interface Esquema {
  dims: DimsGraficaMonte;
  porcentajes: PasosEscalera;
  margenX: number;
  linea: string;
  posY: (valor: number) => number;
}

defineProps<Esquema>();
</script>

<template>
  <g
    v-for="(porcentaje, i) in porcentajes"
    :style="{ transform: `translate(${margenX + dims.anchoSeccion * i}px, 0px)` }"
  >
    <line class="porcentaje" :x1="dims.centroMonte" :y1="dims.techo" :x2="dims.centroMonte" :y2="posY(porcentaje)" />
  </g>
</template>

<style lang="scss">
.lineaRecorrido {
  stroke: rgb(33, 24, 33);
  stroke-width: 0.5;
  height: 150px;
  background: linear-gradient(to right, rgb(244, 126, 130), rgb(162, 232, 197) 100%);
  // fill: rgb(183, 0, 255);
}

.nombreGrupo {
  font-size: 0.85em;
}

.porcentaje {
  stroke: black;
  stroke-width: 1;
  stroke-dasharray: 5;
}
</style>
