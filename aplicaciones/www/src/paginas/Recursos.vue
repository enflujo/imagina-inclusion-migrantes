<template>
  <main class="creditos">
    <h1 id="tituloPagina">Recursos relacionados</h1>

    <p>
      Este <span class="negrita">sitio web</span> es Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
      officia deserunt mollit anim id est laborum
    </p>

    <h2 class="rol">Videos</h2>
  </main>
</template>

<style lang="scss" scoped>
@use '../scss/constantes' as *;

main {
  width: 70vw;
  margin: 0 auto;
}

p {
  font-size: 1.2em;
}

#tituloPagina {
  margin-top: 1em;
  font-size: 3em;
}

@media screen and (min-width: $minPantallaGigante) {
  main {
    width: 50vw;
    margin: 0 auto;
  }
  #tituloPagina {
    margin-top: 1em;
    font-size: 4.5em;
  }
  p {
    font-size: 1.7em;
  }
}
</style>
