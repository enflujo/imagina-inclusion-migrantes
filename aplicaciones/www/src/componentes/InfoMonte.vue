<script setup lang="ts">
import type { DimsGraficaMonte, PasosEscalera } from '@/tipos';
import { escalaColores } from '@enflujo/alquimia';

interface Esquema {
  dims: DimsGraficaMonte;
  porcentajes: PasosEscalera;
  margenX: number;
  linea: string;
  posY: (valor: number) => number;
}

defineProps<Esquema>();

const color = escalaColores(100, 0, '#141414', '#ff0008');
</script>

<template>
  <g
    v-for="(porcentaje, i) in porcentajes"
    :style="{ transform: `translate(${margenX + dims.anchoSeccion * i}px, 0px)` }"
    class="info"
  >
    <line class="porcentaje" :x1="dims.centroMonte" :y1="dims.techo" :x2="dims.centroMonte" :y2="posY(porcentaje)" />
    <text class="textoValor" :x="dims.centroMonte" :y="posY(porcentaje) - 2" :stroke="color(porcentaje)"
      >{{ porcentaje }}%</text
    >
  </g>
</template>

<style lang="scss" scoped>
.info {
  opacity: 0.7;
}

.porcentaje {
  stroke: rgba(236, 13, 13, 0.507);
  stroke-width: 1;
  stroke-dasharray: 5;
}

.textoValor {
  color: #ff0008;
  font-size: 0.8em;
  font-weight: 200;
}
</style>
