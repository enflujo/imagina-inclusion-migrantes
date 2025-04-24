<script setup lang="ts">
import citas from '@/cerebros/citas';
import BotonesCitas from '@/componentes/BotonesCitas.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import Montes from '@/componentes/Montes.vue';
import type { Cita } from '@/tipos';
import { onMounted, ref, type Ref } from 'vue';
import Mapa from '@/componentes/Mapa.vue';
import { duranteInterseccion } from '@/utilidades/observador';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
const info: Ref<HTMLDivElement | null> = ref(null);
const seccionInfo: Ref<Ref<HTMLElement>[]> = ref([]);
const seccionesInfo = ['infoEmbarazadas', 'infoRegularizadas', 'infoAfiliadas', 'infoControles'];
const tipoCita = ref('');
const citaVisible = ref(false);
const textoCita = ref('');
const recursoVisible = ref(false);
const intro: Ref<HTMLDivElement | undefined> = ref();
const animarIntro = ref(false);

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }
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
    <header class="contenedorTitulo">
      <h1 class="tituloPrincipal">Rompiendo Barreras</h1>
      <h2 class="subtitulo">Estrategias para mejorar el acceso a la salud de los migrantes y refugiados en Colombia</h2>
    </header>

    <p>
      Desde 2008 Venezuela atraviesa una crisis política, social y económica que ha crecido con los años y ha
      desencadenado una crisis migratoria y humanitaria en la región.
    </p>

    <div id="contenedorGraficaMig">
      <h3 id="tituloGrafMigrantes" class="tituloGrafica">Migrantes venezolanos en Colombia desde 2008</h3>
      <LineaTiempo :mostrar="animarIntro" />
    </div>

    <p>
      Desde 2014 la cantidad de migrantes en Colombia ha crecido drásticamente. Actualmente, el país acoge a unos 2,8
      millones de migrantes venezolanos (OIM, 2024), siendo el país latinoamericano con más migrantes de esta
      nacionalidad.
    </p>

    <p>
      Un caso particular que nos habla de la situación actual para las y los migrantes en Colombia es el de las barreras
      que existen actualmente para las mujeres embarazadas, quienes tienen enormes dificultades en el proceso de hacerse
      controles prenatales.
    </p>
  </section>

  <div id="contenedorGrafica">
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

      <section class="seccion">
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

      <section id="infoRegularizadas" ref="seccionInfo" class="seccion">
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

      <section id="infoControles" ref="seccionInfo" class="seccion">
        <h2>Utilización del sistema de salud</h2>

        <p>
          Los resultados muestran que las tasas de utilización de servicios de salud de los y las migrantes ha venido
          disminuyendo desde el 2019.
        </p>

        <h3 class="tituloGrafica">Mujeres migrantes venezolanas en Colombia que usan los servicios de salud</h3>
        <img class="imagenGrafica" src="/imgs/migrantes_venezolanas_15_44 años_usan_servicios_medicos.png" />

        <p>
          El uso de servicios de salud creció antes de la pandemia. No obstante, desde el 2019 el uso ha disminuido, lo
          que puede deberse a la buena salud de las migrantes o a la utilización de médicos informales no registrados en
          los sistemas oficiales.
        </p>

        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.afiliadas" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
        </div>

        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.utilizacionA" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
        </div>

        <p>
          Además, nos dimos cuenta que, después del ETPMV, estar afiliado al sistema de seguridad social en salud (es
          decir, tener seguro) mejoró el acceso a atención médica en comparación con aquellos migrantes sin seguro, lo
          que proporciona un efecto protector contra la disminución de utilización de la salud a nivel nacional desde el
          2019.
        </p>

        <p>
          Las entrevistas con mujeres migrantes revelaron que buscan atención principalmente por temas de salud de sus
          hijos o durante el embarazo. Para su propia salud, prefieren evitar el sistema de seguridad social, buscando
          proveedores en el sector privado, como médicos (venezolanos y colombianos) o farmacéuticos, para una atención
          más rápida y sin sentirse discriminadas. La mayoría desea quedarse en Colombia debido a la estabilidad, el
          acceso a empleos informales y las oportunidades de atención médica, aunque enfrentan xenofobia, pagos
          adicionales y atención de emergencia intermitente.
        </p>

        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.utilizacionB" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
        </div>

        <p>
          Aunque algunas mujeres acceden a servicios de emergencia sin tener documentación, existe un desconocimiento
          general sobre los beneficios de la regularización y la afiliación al sistema nacional de salud. Además,
          reportaron necesidades no satisfechas en salud sexual, reproductiva, dental y optometría, y servicios
          preventivos en general, que las lleva a proveedores informales. Las mujeres también informaron que sus mayores
          necesidades de atención médica ocurrieron al llegar a Colombia, especialmente para sus hijos. En cuanto al
          embarazo, algunas indicaron que pudieron acceder a la atención, incluso para el parto, sin estar
          regularizadas, aunque algunas debieron pagar por medicamentos o llevar resultados de ecografías.
        </p>

        <div class="contenedorBurbujas">
          <BotonesCitas :citas="citas.utilizacion" :mostrar-cita="mostrarCita" :esconder-cita="esconderCita" />
        </div>
      </section>

      <section id="infoConclusion" ref="seccionInfo" class="seccion">
        <h2>Conclusión</h2>

        <p>
          El Estatuto Temporal de Protección para Migrantes Venezolanos (ETPMV) ha demostrado ser una herramienta
          efectiva para la afiliación de las mujeres migrantes al sistema de salud colombiano. Entre el 2020 y el 2023,
          hubo un aumento significativo en el cubrimiento de salud, especialmente en los municipios con bajos niveles de
          regularización y afiliación previa. Sin embargo, a pesar del incremento en la afiliación, el uso de los
          servicios de salud ha disminuido, lo que indica que la inscripción en el sistema no garantiza el acceso
          efectivo a la atención médica.
        </p>

        <p>
          Las mujeres migrantes venezolanas siguen enfrentado grandes barreras para acceder al sistema de protección
          social en salud, lo que las lleva a acudir a servicios privados donde asumen un costo de bolsillo alto o a
          servicios informales con una calidad subóptima. La discriminación, la falta de documentación, los costos
          adicionales y el desconocimiento del personal de salud sobre el alcance de emergencias médicas continúan
          limitando su acceso. Además, la disminución del apoyo de las ONG que anteriormente facilitaban el acceso a
          servicios de salud ha dejado a muchas en una situación de vulnerabilidad.
        </p>

        <p>
          Ante estos desafíos, se recomienda fortalecer los mecanismos de regularización (en términos de simplicidad y
          alcance), mejorar la capacitación del personal de salud en prácticas no discriminatorias y ampliar el acceso a
          los servicios de salud sexual y reproductiva para garantizar una atención integral y equitativa.
        </p>
      </section>

      <section class="seccion">
        <h2>Recomendaciones de política pública</h2>

        <ul>
          <li>
            <span class="resaltar"
              >Ampliar la elegibilidad para el ETPMV o implementar políticas similares de regularización:</span
            >
            permitir que más migrantes, incluyendo aquellos que recién llegan, accedan a la regularización y a la
            afiliación a los sistemas de protección social en Colombia.
          </li>

          <li>
            <span class="resaltar">Establecer un mecanismo inclusivo de regularización migratoria:</span> implementar un
            proceso permanente de regularización que otorgue estatus legal a los migrantes venezolanos sin restricciones
            de fecha de ingreso, asegurando una mayor protección, especialmente para padres o cuidadores de niños
            colombianos o migrantes. Este proceso debe estar articulado (y no limitado por) la adquisición de un puntaje
            del Sisbén.
          </li>

          <li>
            <span class="resaltar">Abordar la xenofobia y la discriminación en los servicios de salud:</span> promover
            el acceso equitativo a la atención médica mediante la implementación de capacitaciones para el personal de
            salud sobre prácticas no discriminatorias y campañas de sensibilización para educar a los migrantes sobre
            sus derechos en salud.
          </li>

          <li>
            <span class="resaltar">Ampliar el acceso a los servicios de salud sexual y reproductiva:</span>
            fortalecer la atención en salud sexual y reproductiva para jóvenes migrantes mediante el desarrollo de
            programas educativos, sin importar el estatus migratorio.
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
@use '../scss/constantes' as *;
#aplicacion {
  padding-bottom: 10em;
}

.botonRecurso {
  display: flex;
  align-items: flex-start;
  line-height: 2;
  cursor: pointer;
  width: 45%;
  margin: 0.5em;
  border: 1px dotted black;
  padding: 1.5em;
}

.iconoRecurso {
  width: 25px;
  height: 25px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: contain;
}

// Tablets: 768px;
@media (min-width: $minTablet) {
  .botonRecurso {
    width: 30%;
    padding: 1em;
  }
}

// Dispositivos grandes y pantallas medianas: 992px;
@media (min-width: $minPantalla) {
  .botonRecurso {
    width: 20%;
    padding: 1em;
  }
}
</style>

<style lang="scss" scoped>
@use '../scss/constantes' as *;

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
  width: 75vw;
  margin: 0 auto;
  line-height: 2.5em;

  .contenedorTitulo {
    text-align: center;
    border: 8px solid;
    padding: 1em;
    margin: 5em 0 8em 0;
  }

  .tituloPrincipal {
    font-size: 3em;
    border-bottom: 2px solid;
    padding-bottom: 1em;
  }

  .subtitulo {
    font-size: 2.3em;
  }

  p {
    font-size: 1.5em;
    line-height: 1.2em;
  }
}

.contenedorCita {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(49, 109, 62, 0.9);
  z-index: 9;
  color: white;
  font-size: 1.8em;
  padding: 2em 1em;
  display: none;
  justify-content: center;
  align-items: normal;
  overflow: auto;

  #cerrarCita {
    position: fixed;
    top: 1.5em;
    right: 1.5em;
    cursor: pointer;
  }

  &.visible {
    display: flex;
  }

  &.negativo {
    background-color: rgba(109, 49, 49, 0.9);
  }

  .textoCita {
    width: 70%;
    font-style: italic;
    height: fit-content;
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
  margin: 2em auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 85vw;
  font-size: 0.9em;
}

#contenedorGrafica {
  position: relative;
  margin: 2em auto 0 auto;
  width: 90%;

  .descripcion {
    font-size: 1.3em;
    width: 75vw;
    margin: 0 auto;
  }
}

#escalera {
  display: flex;
  justify-content: center;

  #contenedorGraficaMig {
    position: relative;
    right: 0;
    margin-top: 2em;
    width: 64vw;
  }

  .imagenGrafica {
    width: 75vw;
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
  position: absolute;
  background-color: rgba($colorColombiana, 0.4);
}

.escalonVenezolana {
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
  margin: 2em;
  font-size: 1em;
}

#grafica {
  position: sticky;
  top: 100px;
}

.seccion {
  position: relative;
  margin: 2em auto 3em auto;
  width: 75vw;

  p {
    font-size: 1.3em;
    margin: 1em auto;
  }

  h2 {
    width: 70vw;
    margin: 1em auto;
  }

  ul {
    font-size: 1.3em;
    line-height: 1.7em;

    li {
      margin-bottom: 1em;
    }
  }
}

@media (min-width: $minTablet) {
  #escalera {
    .imagenGrafica {
      width: 60%;
    }
  }

  .contenedorBurbujas {
    width: 70vw;
  }
}

// $minTablet: 768px;
@media (min-width: $minTablet) {
  .tituloGrafica {
    margin: 3em 1em 1em 1em;
  }
}

// Dispositivos grandes y pantallas medianas: 992px;
@media (min-width: $minPantalla) {
  #intro {
    width: 60vw;
    margin: 0 auto 10em auto;
    line-height: 3em;

    p {
      font-size: 1.8em;
      line-height: 1.5em;
    }
  }

  #contenedorGrafica {
    .descripcion {
      width: 70%;
    }
  }

  .seccion {
    width: 70vw;
    p {
      line-height: 1.8em;
    }

    h2 {
      font-size: 1.8em;
    }
  }

  .tituloGrafica {
    position: sticky;
    margin: 4em 1em 1.5em 1em;
    font-size: 1.3em;
  }

  #escalera {
    display: flex;

    #contenedorGraficaMig {
      position: relative;
      right: 0;
      margin-top: 2em;
      width: 64vw;

      .tituloGrafica {
        margin: 0;
      }
    }

    .imagenGrafica {
      width: 50%;
    }
  }

  .contenedorBurbujas {
    justify-content: center;
  }

  .contenedorCita {
    font-size: 2em;
    padding: 2em;
    display: none;
    justify-content: center;
    align-items: center;

    #cerrarCita {
      top: 2em;
      right: 2em;
    }
  }
}

// $minPantallaGrande: 1333px;
@media (min-width: $minPantallaGrande) {
  .tituloGrafica {
    // margin: 6em 1em 2em 1em;
  }
}
</style>
