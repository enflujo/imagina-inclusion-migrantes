<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Simulacion from '@/componentes/Simulacion/index.vue';
</script>

<template>
  <main id="contenedor">
    <Mapa />
    <Lista />
    <Simulacion />
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  display: flex;
  justify-content: space-around;
}
</style>
