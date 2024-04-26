<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/sobre">Sobre</RouterLink>
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

    &.router-link-exact-active {
      background-color: var(--rosado);
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
