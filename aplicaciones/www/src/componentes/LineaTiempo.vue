<script setup lang="ts">
import { datosLinea } from '@/cerebros/lineaTiempo';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

const grafica: Ref<(HTMLElement & SVGElement) | undefined> = ref();

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
    svg.setAttribute('width', `${contenedor.clientWidth}`);
    svg.setAttribute('height', `${svg.clientHeight}`);
  }
}
console.log(datosLinea);
</script>

<template>
  <svg class="lineaTiempo" ref="grafica"></svg>
</template>

<style lang="scss">
.lineaTiempo {
  height: 50vh;
}
</style>
