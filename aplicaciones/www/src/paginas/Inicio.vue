<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Buscador from '@/componentes/Buscador.vue'
import Simulacion from '@/componentes/Simulacion/index.vue';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
</script>

<template>
  <main id="contenedor">
    <Suspense>
      <Buscador />
    </Suspense>
    <Mapa />
    <Lista />
    <div class="seccionLado">
      <Simulacion v-for="id in cerebroDatos.lugaresSeleccionados" :id-lugar="id" :key="`simLugar${id}`" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  display: flex;
  justify-content: space-around;
}
</style>
