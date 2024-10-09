<script setup lang="ts">
import citas from '@/cerebros/citas';
import BotonesCitas from '@/componentes/BotonesCitas.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import Montes from '@/componentes/Montes.vue';
import type { Cita } from '@/tipos';
import { ref, type Ref } from 'vue';

const info: Ref<HTMLDivElement | null> = ref(null);
const seccionInfo: Ref<Ref<HTMLElement>[]> = ref([]);
const seccionesInfo = ['infoEmbarazadas', 'infoRegularizadas', 'infoAfiliadas', 'infoControles'];
const tipoCita = ref('');
const citaVisible = ref(false);
const textoCita = ref('');
const recursoVisible = ref(false);

function irASeccion(i: number) {
  if (!info.value) return;
  const elemento = document.getElementById(seccionesInfo[i]);
  if (!elemento) return;

  elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function mostrarCita(cita: Cita) {
  tipoCita.value = cita.tipo;
  citaVisible.value = true;
  textoCita.value = cita.texto;

  console.log(cita);
}

function esconderCita() {
  citaVisible.value = false;
  textoCita.value = '';
}

function mostrarRecurso(ruta: string) {
  recursoVisible.value = true;
}

function esconderRecurso() {
  recursoVisible.value = false;
  textoCita.value = '';
}
</script>

<template>
  <div id="escalera">
    <!-- <h1>
      ¿Porqué es importante para el país que las mujeres tengan mínimo 4 controles prenatales durante su embarazo?
    </h1> -->
    <div id="info" ref="info">
      <section>
        <h2>Introducción</h2>

        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique odit voluptas magnam fugit officiis nihil
          fugiat laboriosam architecto dignissimos ex corporis eveniet quo, unde reprehenderit. Voluptas amet tenetur
          officia earum.
        </p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis eum omnis ab delectus maiores ea quis
          explicabo earum voluptatibus nihil, ut ducimus iste vitae eligendi culpa aliquam nobis? Voluptatum,
          voluptates?
        </p>
      </section>

      <section id="infoEmbarazadas" ref="seccionInfo">
        <h2>Total de la población</h2>

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur, repudiandae officia. Qui sit dolorum
          similique voluptatem consectetur doloremque delectus excepturi, quos expedita laudantium consequatur culpa
          saepe tempora velit maxime veritatis!
        </p>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit dolor magnam, ab minima necessitatibus non
          reiciendis distinctio unde iste molestias quis rerum? Illum a optio omnis! Error quos architecto fugit.
        </p>

        <BotonesCitas :citas="citas.totalPoblacion" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
      </section>

      <section id="infoRegularizadas" ref="seccionInfo">
        <h2>Regularizadas</h2>

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur, repudiandae officia. Qui sit dolorum
          similique voluptatem consectetur doloremque delectus excepturi, quos expedita laudantium consequatur culpa
          saepe tempora velit maxime veritatis!
        </p>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit dolor magnam, ab minima necessitatibus non
          reiciendis distinctio unde iste molestias quis rerum? Illum a optio omnis! Error quos architecto fugit.
        </p>

        <BotonesCitas :citas="citas.regularizadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
      </section>

      <section id="infoAfiliadas" ref="seccionInfo">
        <h2>Afiliadas al sistema de salud</h2>

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur, repudiandae officia. Qui sit dolorum
          similique voluptatem consectetur doloremque delectus excepturi, quos expedita laudantium consequatur culpa
          saepe tempora velit maxime veritatis!
        </p>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit dolor magnam, ab minima necessitatibus non
          reiciendis distinctio unde iste molestias quis rerum? Illum a optio omnis! Error quos architecto fugit.
        </p>

        <BotonesCitas :citas="citas.afiliadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />

        <div class="botonRecurso" @mouseenter="mostrarRecurso('demo-afiliacion.jpg')" @mouseleave="esconderRecurso">
          <span class="iconoRecurso" :style="{ backgroundImage: `url(/imgs/grafica.svg)` }"></span>
          <span class="fragmentoRecurso">Venezuelan Population Sizes (all genders)</span>
        </div>
      </section>

      <section id="infoControles" ref="seccionInfo">
        <h2>Utilización</h2>

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur, repudiandae officia. Qui sit dolorum
          similique voluptatem consectetur doloremque delectus excepturi, quos expedita laudantium consequatur culpa
          saepe tempora velit maxime veritatis!
        </p>

        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit dolor magnam, ab minima necessitatibus non
          reiciendis distinctio unde iste molestias quis rerum? Illum a optio omnis! Error quos architecto fugit.
        </p>

        <BotonesCitas :citas="citas.utilizacion" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
      </section>
    </div>

    <div id="contenedorGrafica">
      <LineaTiempo />
      <div ref="contenedorCita" :class="`contenedorCita ${tipoCita}${citaVisible ? ' visible' : ''}`">
        <p class="textoCita">
          {{ `"${textoCita}"` }}
        </p>
      </div>

      <div ref="contenedorRecurso" :class="`contenedorRecurso${recursoVisible ? ' visible' : ''}`">
        <img class="imgRecurso" src="/imgs/demo-afiliacion.jpg" />
      </div>

      <div id="grafica" ref="grafica">
        <Montes :irASeccion="irASeccion" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#aplicacion {
  padding-bottom: 10em;
}

.botonRecurso {
  display: flex;
  align-items: center;
  line-height: 2;
  cursor: pointer;
}

.iconoRecurso {
  width: 25px;
  height: 25px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>

<style lang="scss" scoped>
$colorPositivo: rgb(13, 141, 130);
$colorPositivo2: rgb(13, 141, 130);
$colorNegativo: rgb(210, 87, 87);
$colorColombiana: rgb(130, 13, 141);
$altoTotal: 400px;
$anchoEscalon: calc(90vw / 5);
$alto2: calc($altoTotal * 0.8265);
$diferencia1: calc($altoTotal - $alto2);
$alto3: calc($altoTotal * 0.5207);
$diferencia2: calc($alto2 - $alto3);
$alto4: calc($altoTotal * 0.3789);
$diferencia3: calc($alto3 - $alto4);
$alto5: calc($altoTotal * 0.3426);
$diferencia4: calc($alto4 - $alto5);

.contenedorCita {
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background-color: rgba(49, 109, 62, 0.76);
  z-index: 9;
  color: white;
  font-size: 2em;
  padding: 2em;
  display: none;
  justify-content: center;
  align-items: center;

  &.visible {
    display: flex;
  }

  &.negativo {
    background-color: rgba(109, 49, 49, 0.76);
  }

  .textoCita {
    width: 70%;
    font-style: italic;
  }
}

.contenedorRecurso {
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background-color: rgba(22, 24, 22, 0.76);
  z-index: 9;
  color: white;
  display: none;
  justify-content: center;
  align-items: center;

  &.visible {
    display: flex;
  }

  .imgRecurso {
    width: 60%;
    height: auto;
  }
}

#escalera {
  display: flex;

  #info {
    width: 30%;
    border-right: 1px dotted;
    font-size: 1.3em;
    padding-right: 1em;

    section {
      min-height: 100vh;
      padding-top: 1em;
    }
  }

  #contenedorGrafica {
    width: 70%;
  }

  .escalon {
    width: calc(100% / 4);
    text-align: center;
  }

  .comparacion {
    display: flex;
    justify-content: space-evenly;

    .columna {
      width: 40%;
      background-color: red;
    }
  }
}

#umbralDecenal {
  position: absolute;
  width: calc(100% - 10%);
  border-top: 5px solid $colorPositivo;
}

.seccionEscalones {
  position: relative;
  width: 90%;
}

.escalonColombiana {
  // border: 2px solid $colorColombiana;
  position: absolute;
  background-color: rgba($colorColombiana, 0.4);
}

.escalonVenezolana {
  // border: 2px solid $colorPositivo2;
  position: absolute;
  background-color: rgba($colorPositivo2, 0.4);
}

.bajo {
  color: $colorNegativo;
}

.alto {
  color: $colorPositivo;
}

.resaltar {
  font-weight: bold;
}

#grafica {
  // height: 500px;
  // margin: 0 auto;
  // background-color: rgba(245, 245, 245, 0.534);
  display: flex;
  position: sticky;
  top: 100px;
  // padding-left: 5%;

  #lienzo {
    position: absolute;
    left: 5%;
  }

  // .escalon {
  //   font-size: 3vw;
  //   color: $colorPositivo;
  //   position: relative;
  //   border-top: 3px solid $colorPositivo;
  //   border-bottom: 3px solid $colorPositivo;

  //   &:nth-child(1) {
  //     border-left: 3px solid $colorPositivo;
  //   }

  //   &:nth-child(9) {
  //     border-right: 1px solid $colorPositivo;
  //   }

  //   .mensaje {
  //     font-size: 28px;
  //     position: absolute;
  //     left: 0;
  //     bottom: 0px;
  //     width: 90%;
  //     vertical-align: top;
  //   }
  // }

  .diferencia {
    border-style: solid;
    border-color: transparent transparent $colorNegativo transparent;
    position: relative;

    .porcentaje {
      position: absolute;
      top: -20px;
      font-size: 1.3em;
      left: 10px;
    }

    .abajo {
      color: $colorNegativo;
    }
  }

  .diferencia1 {
    height: $diferencia1;
    margin-top: calc(500px - $altoTotal);
    border-width: 0 $diferencia1 $diferencia1 0;
  }

  .diferencia2 {
    height: $diferencia2;
    margin-top: calc(500px - $alto2);
    border-width: 0 $diferencia2 $diferencia2 0;
  }

  .diferencia3 {
    height: $diferencia3;
    margin-top: calc(500px - $alto3);
    border-width: 0 $diferencia3 $diferencia3 0;
  }

  .diferencia4 {
    height: $diferencia4;
    margin-top: calc(500px - $alto4);
    border-width: 0 $diferencia4 $diferencia4 0;
  }

  .escalon1 {
    height: $altoTotal;
    width: $anchoEscalon;
    margin-top: calc(500px - $altoTotal);
  }

  .escalon2 {
    height: $alto2;
    width: calc($anchoEscalon - $diferencia1);
    margin-top: calc(500px - $alto2);
  }

  .escalon3 {
    height: $alto3;
    width: calc($anchoEscalon - $diferencia2);
    margin-top: calc(500px - $alto3);
  }

  .escalon4 {
    height: $alto4;
    width: calc($anchoEscalon - $diferencia3);
    margin-top: calc(500px - $alto4);
  }

  .escalon5 {
    height: $alto5;
    width: calc($anchoEscalon - $diferencia4);
    margin-top: calc(500px - $alto5);
  }
}

// .columnas {
//   display: flex;
//   justify-content: space-around;

//   .columna {
//     width: 48%;

//     h2 {
//       text-align: center;
//     }
//   }
// }

// .enlace {
//   cursor: pointer;
//   padding: 0.3em;
//   background-color: white;
// }

header {
  width: 50vw;
  margin: 2em auto 0.2em;

  h1 {
    font-size: 3em;
    text-align: center;
  }

  p {
    font-size: 2em;
  }
}

// .escalon {
//   height: 200px;
//   font-size: 1.8em;
//   color: rgb(246, 239, 217);

//   p {
//     text-align: center;
//     margin: 0;
//   }
// }

// .contenido {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   // transform: translateX(-50%);
// }

// .cubierto {
//   background-color: $colorPositivo;
//   height: 100%;
//   display: inline-block;
//   position: relative;
// }

// .vacio {
//   background-color: $colorNegativo;
//   height: 100%;
//   display: inline-block;
// }

// .conteo {
//   font-weight: bold;
//   letter-spacing: 2px;
//   font-size: 2.5em;
// }

// .total {
//   width: 100%;
//   background-color: $colorPositivo;
//   color: rgb(246, 239, 217);
//   padding: 1em;
// }
//
</style>
