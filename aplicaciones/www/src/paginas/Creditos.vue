<template>
  <main class="creditos">
    <h1 id="tituloPagina">Créditos</h1>

    <div class="textoCreditos">
      <p>
        Este <span class="negrita">sitio web</span> es Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
        qui officia deserunt mollit anim id est laborum
      </p>
    </div>

    <div>
      <a href="" target="_blank"> <img class="logoGrande" src="" alt="LogoProyectoOrganizaciónPrincipal" /></a>
    </div>

    <h2 class="rol">Organiza</h2>
    <div class="filaLogos"></div>

    <h2 class="rol">Lidera</h2>
    <div class="filaLogos"></div>

    <h2 class="rol">Desarrolla:</h2>

    <a href="https://imagina.uniandes.edu.co/" target="_blank">
      <img class="logoImagina logoGrande" src="/imgs/logo_imagina.svg" alt="Logo Centro IMAGINA"
    /></a>

    <a href="https://enflujo.com" target="_blank">
      <img class="logoEnFlujo logoGrande" src="/imgs/enflujo_andes.svg" alt="Logo Laboratorio EnFlujo"
    /></a>

    <div class="listaAgentes">
      <ol></ol>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '../estaticos/constantes';

main {
  width: 70vw;
  margin: 0 auto;
}

p {
  font-size: 1.2em;
}
.negrita {
  font-weight: 700;
}

#tituloPagina {
  margin-top: 1em;
  font-size: 3em;
}

.filaLogos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.logoGrande {
  display: block;
  height: 180px;
  width: auto;
  margin: 2em auto 0 auto;

  &.logoImagina {
    height: auto;
    width: 70vw;
  }

  &.logoEnFlujo {
    height: auto;
    width: 70vw;
    padding-bottom: 20vh;
  }
}

#creditos {
  .textoIntro {
    ul {
      margin-top: 2em;
      .textoCreditos {
        margin-top: -0.5em;
      }
    }
  }

  h3 {
    font-size: 1em;
  }

  li {
    margin-left: 2em;
  }

  .listaAgentes {
    line-height: 1em;
    .textoCreditos {
      padding-bottom: 0.3em;
    }
  }

  .rol {
    font-size: 1.5em;
    padding: 3em 0 1em 0;
    line-height: 1.2em;
  }
}

@media screen and (min-width: $minTablet) {
  .logoGrande {
    &.logoImagina {
      width: 60vw;
    }

    &.logoEnFlujo {
      width: 60vw;
    }
  }
}

@media screen and (min-width: $minPantalla) {
  .filaLogos {
    display: flex;
    justify-content: center;
    flex-wrap: unset;
  }
  .logoGrande {
    &.logoImagina {
      width: 40vw;
    }

    &.logoEnFlujo {
      width: 40vw;
    }
  }
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
  .rol {
    font-size: 2.2em;
  }
  .listaAgentes {
    line-height: 1em;
    .textoCreditos {
      padding-bottom: 0.3em;
    }
  }

  li {
    margin-left: 2em;
  }

  .logoGrande {
    display: block;
    height: 10vh;
    width: auto;
    margin: 2em auto 0 auto;

    &.logoImagina {
      width: 30vw;
    }

    &.logoEnFlujo {
      width: 30vw;
    }
  }
}
</style>
