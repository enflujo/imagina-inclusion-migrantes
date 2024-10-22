<script setup lang="ts">
import citas from '@/cerebros/citas';
import BotonesCitas from '@/componentes/BotonesCitas.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import Montes from '@/componentes/Montes.vue';
import type { Cita } from '@/tipos';
import { onMounted, ref, type Ref } from 'vue';
import Mapa from './Mapa.vue';
import { duranteInterseccion } from '@/utilidades/observador';

const info: Ref<HTMLDivElement | null> = ref(null);
const seccionInfo: Ref<Ref<HTMLElement>[]> = ref([]);
const seccionesInfo = ['infoEmbarazadas', 'infoRegularizadas', 'infoAfiliadas', 'infoControles'];
const tipoCita = ref('');
const citaVisible = ref(false);
const textoCita = ref('');
const recursoVisible = ref(false);
const intro: Ref<HTMLDivElement | undefined> = ref();
const animarIntro = ref(false);

onMounted(() => {
  if (intro.value) {
    duranteInterseccion(
      intro.value,
      () => {
        animarIntro.value = true;
      },
      false,
      { threshold: [0.1] },
      () => {
        animarIntro.value = false;
        console.log('fuera');
      }
    );
  }
});

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
  <section id="intro" ref="intro">
    <h1>Rompiendo barreras: estrategias para mejorar el acceso a la salud de los migrantes y refugiados en Colombia</h1>

    <p>
      Desde 2008 Venezuela atraviesa una crisis política, social y económica que ha crecido con los años y ha
      desencadenado una crisis migratoria y humanitaria en la región. Desde 2014 la cantidad de migrantes en Colombia ha
      crecido drásticamente. Actualmente, el país acoge a unos 2,8 millones de migrantes venezolanos (OIM, 2024), siendo
      el país latinoamericano con más migrantes de esta nacionalidad.
    </p>

    <div id="contenedorGraficaMig">
      <h3 id="tituloGrafMigrantes" class="tituloGrafica">Migrantes venezolanos en Colombia desde 2008</h3>
      <LineaTiempo :mostrar="animarIntro" />
    </div>
  </section>

  <div id="contenedorGrafica">
    <div class="descripcion">
      <p>
        Un caso particular que nos habla de la situación actual para las y los migrantes en Colombia es el de las
        barreras que existen actualmente para las mujeres embarazadas, quienes tienen enormes dificultades en el proceso
        de hacerse controles prenatales.
      </p>
    </div>

    <div id="grafica" ref="grafica">
      <h3 class="tituloGrafica">Situación de las mujeres venezolanas embarazadas en el sistema de salud colombiano</h3>
      <Montes :irASeccion="irASeccion" />
    </div>
  </div>

  <div id="escalera">
    <div id="info" ref="info">
      <div
        ref="contenedorCita"
        :class="`contenedorCita ${tipoCita}${citaVisible ? ' visible' : ''}`"
        @click="esconderCita"
      >
        <span id="cerrarCita" @click="esconderCita">X</span>
        <p class="textoCita">
          {{ `"${textoCita}"` }}
        </p>
      </div>
      <section>
        <h2>El proyecto</h2>
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
          ETPMV sobre el acceso a servicios y salud, se realizaron entrevistas a mujeres migrantes y actores clave.
          También se entrevistaron representantes de organizaciones del Grupo Interagencial de Flujos Migratorios Mixtos
          (GIFMM) para entender y triangular toda la evidencia recogida.
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
        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.regularizadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
        </div>
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

        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.afiliadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
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
          Durante las entrevistas se percibió que cuando los migrantes llegaron por primera vez a Colombia, la
          utilización del sistema de salud era mayor que en la actualidad. Muchas reportaron haber cruzado la frontera
          con niños y adolescentes que rápidamente necesitaban servicios de salud como vacunas o chequeos pediátricos de
          crecimiento y desarrollo.
        </p>
        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.utilizacion" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
#aplicacion {
  padding-bottom: 10em;
}

.botonRecurso {
  display: flex;
  align-items: flex-start;
  line-height: 2;
  cursor: pointer;
  width: 30%;
  margin: 0 1em 0.7em 0;
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

#intro {
  width: 60vw;
  margin: 0 auto 10em auto;
  // min-height: 100vh;

  h1 {
    font-size: 2.5em;
    text-align: center;
    border: 3px solid;
    padding: 1em;
  }

  p {
    font-size: 1.8em;
  }
}

.contenedorCita {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(49, 109, 62, 0.76);
  z-index: 9;
  color: white;
  font-size: 2em;
  padding: 2em;
  display: none;
  justify-content: center;
  align-items: center;

  #cerrarCita {
    position: fixed;
    top: 2em;
    right: 2em;
    cursor: pointer;
  }

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

.contenedorBurbujas {
  margin-top: 2em;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

#contenedorGrafica {
  position: relative;
  margin: 2em auto 0 auto;
  width: 90%;

  .descripcion {
    font-size: 1.3em;
    width: 70%;
    margin: 0 auto;
  }
}

#escalera {
  display: flex;

  #info {
    width: 60%;
    border-right: 1px dotted;
    font-size: 1.3em;
    padding: 0 4em 0 3em;
    margin: 0 auto;

    section {
      padding-top: 1em;
    }
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
  position: sticky;
  top: 100px;
}

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
</style>
