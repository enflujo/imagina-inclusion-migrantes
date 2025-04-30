<template>
  <main class="creditos">
    <h1 id="tituloPagina">Créditos</h1>

    <h2>Líderes</h2>

    <ul>
      <li>Diana Bowser</li>
      <li>Arturo Harker</li>
      <li>Brielle Ruscitti</li>
      <li>Priya Agarwal-Harding</li>
      <li>Donald Shepard</li>
      <li>Tatiana Andia</li>
      <li>Eliana Pineda</li>
      <li>Carlos William Rincón Pérez</li>
      <li>Salomé González Buitrago</li>
      <li>Angélica Cantor Ortiz</li>
    </ul>

    <h2 class="rol">Desarrollo</h2>

    <ul class="logos">
      <li>
        <a href="https://imagina.uniandes.edu.co/" target="_blank">
          <img class="logoImagina" src="/imgs/logo_imagina.svg" alt="Logo Centro Imagina" />
        </a>
      </li>

      <li>
        <a href="https://enflujo.com" target="_blank">
          <img class="logoEnFlujo" src="/imgs/enflujo_andes.svg" alt="Logo Laboratorio EnFlujo" />
        </a>
      </li>
    </ul>

    <h2 class="rol">Financiación</h2>

    <div class="listaAgentes">
      <ul>
        <li>
          <a href="https://www.elrha.org/" target="_blank">
            <img class="logoElrha" src="/imgs/r2hc-logo.webp" alt="Logo elrha" />
          </a>
        </li>
      </ul>
    </div>
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

.logos {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-end;

  li {
    img {
      height: 70px;
    }
  }

  .logoEnFlujo {
    height: 63px;
  }

  .logoElrha {
    height: 70px;
  }
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
