<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Buscador from '@/componentes/Buscador.vue';
import Simulacion from '@/componentes/Simulacion/index.vue';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
import Comparacion from '@/componentes/Comparacion.vue';
</script>

<template>
  <main id="contenedor">
    <Mapa />
    <section id="columnaCentral">
      <Lista />
      <Comparacion />
    </section>
    <div class="seccionLado">
      <Simulacion
        v-for="lugar in cerebroDatos.lugaresSeleccionados"
        :id-lugar="lugar.id"
        :key="`simLugar${lugar.id}`"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  display: flex;
  justify-content: space-around;
}
</style>
