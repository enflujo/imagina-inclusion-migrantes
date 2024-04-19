<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Buscador from '@/componentes/Buscador.vue';
import Simulacion from '@/componentes/Simulacion/index.vue';
</script>

<template>
  <main id="contenedor">
    <Suspense>
      <Buscador />
    </Suspense>
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
