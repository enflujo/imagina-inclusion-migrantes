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

<style lang="scss" scoped>
.porcentaje {
  stroke: rgba(236, 13, 13, 0.507);
  stroke-width: 1;
  stroke-dasharray: 5;
}
</style>
