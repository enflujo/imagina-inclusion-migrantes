<script setup lang="ts">
import Lista from '@/componentes/Lista.vue';
import Mapa from '@/componentes/Mapa.vue';
import Simulacion from '@/componentes/Simulacion/index.vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import Comparacion from '@/componentes/Comparacion.vue';
import { useHead } from '@unhead/vue';

const cerebroDatos = usarCerebroDatos();
const SEO = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Colorado Springs',
    addressRegion: 'CO',
    postalCode: '80840',
    streetAddress: '100 Main Street',
  },
  colleague: ['http://www.example.com/JohnColleague.html', 'http://www.example.com/JameColleague.html'],
  email: 'info@example.com',
  image: 'janedoe.jpg',
  jobTitle: 'Research Assistant',
  name: 'Jane Doe',
  alumniOf: 'Dartmouth',
  birthPlace: 'Philadelphia, PA',
  birthDate: '1979-10-12',
  height: '72 inches',
  gender: 'female',
  memberOf: 'Republican Party',
  nationality: 'Albanian',
  telephone: '(123) 456-6789',
  url: 'http://www.example.com',
  sameAs: [
    'https://www.facebook.com/',
    'https://www.linkedin.com/',
    'http://twitter.com/',
    'http://instagram.com/',
    'https://plus.google.com/',
  ],
};

useHead({
  title: 'prueba',
  script: [{ hid: 'json-ld', type: 'application/ld+json', textContent: JSON.stringify(SEO) }],
});
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
