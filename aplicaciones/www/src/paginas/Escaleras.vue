<script setup lang="ts">
import Particula from '@/componentes/Particula';
import { escalaColores } from '@enflujo/alquimia';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

let reloj = 0;
const llaves = ['regularizadas', 'afiliadas', 'atendidas', 'cuatroControles'];
const totalV = 1468809;
// $colorPositivo: rgb(13, 141, 130);
// $colorPositivo2: rgb(13, 141, 130);
// $colorNegativo: rgb(210, 87, 87);
/**
 * $anchoEscalon: calc(90vw / 5);
  $alto2: calc($altoTotal * 0.8265);
  $diferencia1: calc($altoTotal - $alto2);
  $alto3: calc($altoTotal * 0.5207);
  $diferencia2: calc($alto2 - $alto3);
  $alto4: calc($altoTotal * 0.3789);
  $diferencia3: calc($alto3 - $alto4);
  $alto5: calc($altoTotal * 0.3426);
  $diferencia4: calc($alto4 - $alto5);
 */

const color = escalaColores(0, 100, '#963c3c', '#5a997e');

const totalEmbarazadasV = 76599;
const datosControlesV = [63306, 39883, 28246, 26243];
const diferenciasV = datosControlesV.map((valor) => totalEmbarazadasV - valor);
const diferenciasPorcentajeV = diferenciasV.map((valor) => +((valor / totalEmbarazadasV) * 100).toFixed(2));
const saltosDiferencias: number[] = [];
const porcentajesV = datosControlesV.map((valor) => +((valor / totalEmbarazadasV) * 100).toFixed(2));
const anchos = porcentajesV.map((valor, i) => [100 * (valor / 100), 100 * (diferenciasPorcentajeV[i] / 100)]);
/** 
 * Según el Plan Decenal de Salud el 95 % de las mujeres gestantes debe tener cuatro o más controles prenatales.
Según la meta de los Objetivos de Desarrollo Sostenible (ODS), para el 2030, el 93 % de las gestantes debe tener cuatro o más controles prenatales
 */
const umbralPlanDecenal = 95;
const umbralODS = 93;

anchos.forEach((valores, i) => {
  const anterior = i === 0 ? 0 : anchos[i - 1][1];
  saltosDiferencias.push(+(valores[1] - anterior).toFixed(2));
});

const totalEmbarazadasC = 623715;
const datosControlesC = [623715, 623715, 623715, 480334];
const porcentajesC = datosControlesC.map((valor) => +((valor / totalEmbarazadasC) * 100).toFixed(2));
const pasoX = 105 / (datosControlesC.length + 1);

// const pasoX: Ref<number> = ref(0);

// console.log(porcentajesC);

// function escalar() {
//   pasoX.value = datosControlesC
// }
</script>

<template>
  <!-- <nav id="navegacionInterna">
    <ul>
      <li><a class="enlace">Antes del estatuto temporal de permanencia</a></li>
    </ul>
  </nav> -->
  <header>
    <h1>Controles prenatales durante el embarazo</h1>

    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente veritatis repellat molestiae incidunt
      voluptatem reprehenderit ex, sint architecto vero ut ipsa, nulla sit facere quas dignissimos ea possimus
      blanditiis suscipit.
    </p>

    <!-- <p class="pregunta">
      Son <span class="bajo resaltar">pocas</span> las mujeres venezolanas que se realizan los cuatro controles
      prenatales durante su embarazo, apenas un tercio: <span class="bajo resaltar">{{ porcentajesV[3] }}%</span>
    </p>

    <p>
      <span class="resaltar bajo">Uno de los mayores problema</span> es la afiliación, tan solo la mitad de las mujeres
      embarazadas está afiliada al sistema de salud: <span class="resaltar bajo">{{ porcentajesV[1] }}%</span>
    </p>

    <p>
      <span class="resaltar bajo">Se debe mejorar</span> el uso del sistema para así mejorar el número de mujeres
      embarazadas que se realicen los 4 controles: actualmente, sólo el
      <span class="resaltar bajo">{{ porcentajesV[2] }}%</span>
    </p> -->
  </header>

  <div id="grafica" ref="grafica">
    <span id="umbralDecenal" :style="`bottom:${umbralPlanDecenal}%`"></span>

    <div class="seccionEscalones">
      <span :style="`left: 0%; top: ${0}%; width: ${pasoX}%;height:100%`" class="escalonColombiana"> </span>
      <span
        v-for="(valor, i) in porcentajesC"
        :ref="`porcentajeCol${i}`"
        :style="`left: ${(i + 1) * pasoX}%; top: ${100 - valor}%; width: ${pasoX}%;height: ${valor}%`"
        class="escalonColombiana"
      >
      </span>

      <span :style="`left: 0%; top: ${0}%; width: ${pasoX}%;height:100%`" class="escalonVenezolana"> </span>

      <span
        v-for="(valor, i) in porcentajesV"
        :ref="`porcentajeCol${i}`"
        :style="`left: ${(i + 1) * pasoX}%; top: ${100 - valor}%; width: ${pasoX}%;height: ${valor}%`"
        class="escalonVenezolana"
      >
      </span>
    </div>

    <!-- <span class="escalon escalon1" :style="`color:${color(100)}`"
      >100% <span class="mensaje">Mujeres Venezolanas embarazadas</span></span
    >
    <span class="diferencia diferencia1">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[0] }}%</span>
    </span>
    <span
      class="escalon escalon2"
      :style="`font-size:${3 * (porcentajesV[0] / 100)}vw; color:${color(porcentajesV[0])}`"
    >
      {{ porcentajesV[0] }}%
      <span class="mensaje">Regularizadas</span>
    </span>
    <span class="diferencia diferencia2">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[1] }}%</span>
    </span>
    <span
      class="escalon escalon3"
      :style="`font-size:${3 * (porcentajesV[1] / 100)}vw; color:${color(porcentajesV[1])}`"
      >{{ porcentajesV[1] }}%
      <span class="mensaje">Afiliadas al sistema de salud</span>
    </span>
    <span class="diferencia diferencia3">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[2] }}%</span>
    </span>
    <span
      class="escalon escalon4"
      :style="`font-size:${3 * (porcentajesV[2] / 100)}vw; color:${color(porcentajesV[2])}`"
      >{{ porcentajesV[2] }}%
      <span class="mensaje">Atendidas dentro del sistema de salud</span>
    </span>
    <span class="diferencia diferencia4">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[3] }}%</span>
    </span>
    <span
      class="escalon escalon5"
      :style="`font-size:${3 * (porcentajesV[3] / 100)}vw; color:${color(porcentajesV[3])}`"
      >{{ porcentajesV[3] }}%
      <span class="mensaje">Hicieron sus 4 controles prenatales</span>
    </span> -->

    <!-- <canvas id="lienzo" ref="refLienzo"></canvas> -->
  </div>

  <!-- <div class="columnas">
    <section id="areaColombianas" class="columna">
      <h2>Colombianas</h2>

      <div class="total escalon">
        <p>
          En el año 2024, hay un total de <span class="conteo">{{ numeroConteo(totalEmbarazadasC) }}</span> mujeres
          embarazadas en Colombia.
        </p>
      </div>

      <div class="escalon subEscalon" v-for="(escalon, i) in porcentajesC">
        <span class="cubierto" :style="`width:${escalon}%`">
          <span class="contenido">{{ nombres[i] }}: {{ escalon }}% ({{ numeroConteo(datosControlesC[i]) }})</span>
        </span>

        <span class="vacio" :style="`width:${100 - escalon}%`"></span>
      </div>
    </section>

    <section id="areaVenezolanas" class="columna">
      <h2>Venezolanas</h2>

      <div class="total escalon">
        <p>
          En el año 2024, hay un total de <span class="conteo">{{ numeroConteo(totalEmbarazadasV) }}</span> mujeres
          venezolanas embarazadas en Colombia.
        </p>
      </div>

      <div class="escalon subEscalon" v-for="(escalon, i) in porcentajesV">
        <span class="cubierto" :style="`width:${escalon}%`">
          <span class="contenido">{{ nombres[i] }}: {{ escalon }}% ({{ numeroConteo(datosControlesV[i]) }})</span>
        </span>

        <span class="vacio" :style="`width:${100 - escalon}%`"></span>
      </div>
    </section>
  </div> -->
</template>

<style lang="scss">
#aplicacion {
  padding-bottom: 10em;
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
  height: 500px;
  margin: 0 auto;
  background-color: rgba(245, 245, 245, 0.534);
  display: flex;
  position: relative;
  padding-left: 5%;

  #lienzo {
    position: absolute;
    left: 5%;
  }

  .escalon {
    font-size: 3vw;
    color: $colorPositivo;
    position: relative;
    border-top: 3px solid $colorPositivo;
    border-bottom: 3px solid $colorPositivo;

    &:nth-child(1) {
      border-left: 3px solid $colorPositivo;
    }

    &:nth-child(9) {
      border-right: 1px solid $colorPositivo;
    }

    .mensaje {
      font-size: 28px;
      position: absolute;
      left: 0;
      bottom: 0px;
      width: 90%;
      vertical-align: top;
    }
  }

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
