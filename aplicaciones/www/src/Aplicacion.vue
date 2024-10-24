<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

import { useHead } from '@unhead/vue';
import type { Organization, Person } from 'schema-dts';

const SEOEnflujo: Organization = {
  '@type': 'ResearchOrganization',
  name: 'EnFlujo',
  url: 'enflujo.com',
};

useHead({
  titleTemplate: '%s %separator %siteName',
  templateParams: { separator: '|', siteName: 'Rompiendo Barreras' },
  meta: [
    {
      name: 'description',
      content: 'Estrategias para mejorar el acceso a la salud de los migrantes y refugiados en Colombia.',
    },
  ],
  script: [{ hid: 'json-ld', type: 'application/ld+json', textContent: JSON.stringify(SEOEnflujo) }],
});
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <!-- <RouterLink to="/mapa">Mapa</RouterLink> -->
      <RouterLink to="/creditos">Créditos</RouterLink>
      <RouterLink to="/recursos">Recursos</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  margin-bottom: 1em;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  margin-top: 1rem;

  a,
  a:link {
    color: var(--negro);
    padding: 0 1rem;
    border-left: 1px solid;
    text-decoration: none;

    &.router-link-exact-active {
      background-color: black;
      color: var(--blanco);

      &:hover {
        opacity: 0.7;
      }
    }

    &:first-of-type {
      border: 0;
    }
  }
}
</style>
