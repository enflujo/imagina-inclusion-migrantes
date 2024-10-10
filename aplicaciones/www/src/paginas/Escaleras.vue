<script setup lang="ts">
import citas from '@/cerebros/citas';
import BotonesCitas from '@/componentes/BotonesCitas.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import Montes from '@/componentes/Montes.vue';
import type { Cita } from '@/tipos';
import { baseUrl } from '@/utilidades/ayudas';
import { ref, type Ref } from 'vue';
import Mapa from './Mapa.vue';

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
        <h2>
          Rompiendo barreras: estrategias para mejorar el acceso a la salud de los migrantes y refugiados en Colombia
        </h2>

        <p>
          Desde el 2008 Venezuela atraviesa una crisis política, social y económica, que ha crecido con los años y ha
          desencadenado una crisis migratoria y humanitaria en la región. Desde el 2014 el aumento de migrantes en
          Colombia ha crecido drásticamente. Actualmente, el país acoge a unos 2,8 millones de migrantes venezolanos
          (OIM, 2024), siendo el país latinoamericano con más migrantes de esta nacionalidad.
        </p>

        <div id="contenedorGraficaMig">
          <h3 id="tituloGrafMigrantes" class="tituloGrafica">Migrantes venezolanos en Colombia desde 2008</h3>
          <LineaTiempo />
        </div>

        <p>
          Con esta situación en mente, la Universidad de los Andes, Brandeis University y Boston College, con el apoyo
          de ELRHA, realizaron la investigación “Fortalecimiento del sistema de salud para reducir la morbilidad y
          mortalidad de mujeres y niños migrantes venezolanos en Colombia”, con el objetivo de determinar el impacto del
          “Permiso de Protección Temporal” (PPT), otorgado a través del “Estatuto de Protección Temporal para Migrantes
          Venezolanos” ETPMV en la afiliación al sistema de salud, el acceso a los servicios y, finalmente, la
          morbilidad y mortalidad de mujeres venezolanas y sus hijos.
        </p>

        <p>
          Dado que cerca del 80% de los migrantes ha obtenido o está en proceso de obtener el (PPT), este mecanismo de
          regularización migratoria debería ser un conducto efectivo para permitir la inscripción en al sistema de salud
          y, por ende, tener un gran potencial para mejorar el acceso a servicios de prevención, atención y salud de
          mujeres migrantes. No obstante, la evidencia muestra que existen barreras importantes que limitan el impacto
          de la política de regularización sobre la salud.
        </p>
      </section>

      <section id="infoRegularizadas" ref="seccionInfo">
        <h2>Regularización</h2>

        <p>
          Para documentar los cambios tras la implementación del ETPMV, este estudio utiliza los datos administrativos
          del sistema de salud colombiano y la información recogida a través de encuestas telefónicas a mujeres
          migrantes venezolanas. Adicionalmente, para identificar y entender las barreras que limitan el impacto del
          ETPMV sobre el acceso a servicios y la salud, se realizaron entrevistas a mujeres migrantes y actores clave.
          También, se entrevistaron a representantes de organizaciones del Grupo Interagencial de Flujos Migratorios
          Mixtos (GIFMM) para entender y triangular toda la evidencia recogida.
        </p>

        <p>
          En primer lugar, los resultados muestran que el número de migrantes regularizados (afiliados al sistema de
          salud) en los últimos años ha aumentado notablemente, un resultado positivo del ETPMV.
        </p>

        <h3 class="tituloGrafica">
          Probabilidad de utilizar los servicios de salud para mujeres migrantes venezolanas y los miembros de sus
          hogares en los últimos 30 días, antes y después del ETPMV (N=4,423)
        </h3>
        <img class="imagenGrafica" src="/imgs/total_afiliacion_recortada.png" />

        <p>
          La investigación encontró que los impactos de tener acceso a los servicios de salud son mayores en los
          municipios con menores niveles de regularización y afiliación al seguro de salud. Los principales destinos de
          los migrantes venezolanos son las ciudades de frontera y ciudades como Bogotá, por lo que este hallazgo podría
          reflejar una mayor necesidad de que los migrantes en situación de tránsito accedan a los servicios públicos de
          salud para cubrir sus necesidades de atención médica. Poseer un documento de regularización facilita el acceso
          al sistema de salud para las mujeres migrantes y sus hijos.
        </p>

        <Mapa />

        <BotonesCitas :citas="citas.regularizadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
      </section>

      <section id="infoAfiliadas" ref="seccionInfo">
        <h2>Afiliación</h2>

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur, repudiandae officia. Qui sit dolorum
          similique voluptatem consectetur doloremque delectus excepturi, quos expedita laudantium consequatur culpa
          saepe tempora velit maxime veritatis!
        </p>

        <h3 class="tituloGrafica">Mujeres migrantes venezolanas en Colombia entre 15 y 44 años</h3>
        <img class="imagenGrafica" src="/imgs/migrantes_venezolanas_colombia_15_44_años.png" />

        <h3 class="tituloGrafica">Mujeres migrantes venezolanas en Colombia que usan los servicios de salud</h3>
        <img class="imagenGrafica" src="/imgs/migrantes_venezolanas_15_44 años_usan_servicios_medicos.png" />

        <BotonesCitas :citas="citas.afiliadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />

        <div class="botonRecurso" @mouseenter="mostrarRecurso('demo-afiliacion.jpg')" @mouseleave="esconderRecurso">
          <span class="iconoRecurso" :style="{ backgroundImage: `url(${baseUrl}/imgs/grafica.svg)` }"></span>
          <span class="fragmentoRecurso">Venezuelan Population Sizes (all genders)</span>
        </div>
      </section>

      <section id="infoControles" ref="seccionInfo">
        <h2>Utilización del sistema de salud</h2>

        <p>
          Algunos de los resultados de las entrevistas muestran que las migrantes han buscado atención médica para la
          salud de sus hijos o durante el embarazo. Pocas mencionaron haber caído enfermas y recurrido al sistema de
          salud público. Es común que busquen atención médica en el sector privado, como médicos venezolanos dentro de
          la comunidad, farmacéuticos y clínicas privadas. El acceso a oportunidades de empleo informal y a los
          servicios de salud motiva a las mujeres migrantes a permanecer en territorio colombiano. Existe una gran
          demanda de atención en salud sexual y reproductiva, y servicios dentales y oftalmológicos.
        </p>

        <p>
          En cuanto a la atención prenatal, algunas mujeres indicaron que pudieron acceder a ella incluso sin estar
          regularizadas, aunque debían llevar sus resultados de ecografías y comprar algunos medicamentos. También han
          podido dar a luz o someterse a cesáreas sin complicaciones.
        </p>

        <p>
          Durante las entrevistas, se percibió que cuando los migrantes llegaron por primera vez a Colombia, la
          utilización del sistema de salud era mayor que en la actualidad. Muchas reportaron haber cruzado la frontera
          con niños y adolescentes que rápidamente necesitaban servicios de salud como vacunas o chequeos pediátricos de
          crecimiento y desarrollo.
        </p>

        <BotonesCitas :citas="citas.utilizacion" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
      </section>
    </div>

    <div id="contenedorGrafica">
      <div ref="contenedorCita" :class="`contenedorCita ${tipoCita}${citaVisible ? ' visible' : ''}`">
        <p class="textoCita">
          {{ `"${textoCita}"` }}
        </p>
      </div>

      <h3 class="tituloGrafica">Situación de las mujeres venezolanas embarazadas en el sistema de salud colombiano</h3>

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
  width: 45%;
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
    width: 70%;
    border-right: 1px dotted;
    font-size: 1.3em;
    padding: 0 4em 0 3em;

    section {
      min-height: 100vh;
      padding-top: 1em;
    }
  }

  #contenedorGrafica {
    position: relative;
    right: 0;
    margin-top: 2em;
  }

  #contenedorGraficaMig {
    position: relative;
    right: 0;
    margin-top: 2em;
    width: 64vw;
  }

  .imagenGrafica {
    width: 60%;
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

.tituloGrafica {
  position: sticky;
  margin: 1em;
  font-size: 0.9em;
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
