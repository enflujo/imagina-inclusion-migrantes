<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Simulacion from '@/componentes/Simulacion/index.vue';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
</script>

<template>
  <main id="contenedor">
    <Mapa />
    <Lista />
    <Simulacion v-for="id in cerebroDatos.lugaresSeleccionados" :id-lugar="id" :key="`simLugar${id}`" />
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  display: flex;
  justify-content: space-around;
}
</style>
