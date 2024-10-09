<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Simulacion from '@/componentes/Simulacion/index.vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import Comparacion from '@/componentes/Comparacion.vue';
import { useHead } from '@unhead/vue';
import type { Organization, Person } from 'schema-dts';

const cerebroDatos = usarCerebroDatos();
const SEOEnflujo: Organization = {
  '@type': 'ResearchOrganization',
};

useHead({
  title: 'Mapa con índices de inclusión a migrantes en Colombia',
  script: [{ hid: 'json-ld', type: 'application/ld+json', textContent: JSON.stringify(SEOEnflujo) }],
});
</script>

<template>
  <main id="contenedor">
    <Mapa />
    <section id="columnaCentral">
      <Lista />
      <!--  <Comparacion /> -->
    </section>
    <!--   <div class="seccionLado">
      <Simulacion
        v-for="lugar in cerebroDatos.lugaresSeleccionados"
        :id-lugar="lugar.id"
        :key="`simLugar${lugar.id}`"
      />
    </div> -->
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  display: flex;
  justify-content: space-around;
}
</style>
