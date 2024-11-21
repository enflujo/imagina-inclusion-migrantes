<script setup lang="ts">
import type { PasosEscalera, PuntoSimple, TiposMujeres } from '@/tipos';
import { convertirEscala } from '@enflujo/alquimia';
import { onMounted, onUnmounted, ref, useTemplateRef, type Ref } from 'vue';
import InfoMonte from './InfoMonte.vue';
import Particula from './Particula';
import { formatoNumero, numeroAleatorio } from '@/utilidades/ayudas';

interface Esquema {
  irASeccion: (i: number) => void;
}

defineProps<Esquema>();
const grafica: Ref<(HTMLElement & SVGElement) | undefined> = ref();
const lineaV = ref('');
const lineaC = ref('');
const lineaI = ref('');
const info: Ref<HTMLDivElement | null> = ref(null);
const mostrarInfo = ref(false);
const numeroSecciones = ref(0);
const margenX = 100;
const dims = ref({
  anchoTotal: 0,
  altoTotal: 0,
  ancho: 0,
  alto: 0,
  piso: 0,
  techo: 0,
  anchoSeccion: 0,
  centroMonte: 0,
});
const particulas: Ref<Particula[]> = ref([]);
const mujeres = useTemplateRef<HTMLSpanElement[]>('mujeres');

const posY = (valor: number) => convertirEscala(valor, 0, 100, 10, dims.value.piso);
const datosControlesV: PasosEscalera = [76599, 63306, 39883, 26243];
const porcentajesV = datosControlesV.map((valor) => +((valor / datosControlesV[0]) * 100).toFixed(2)) as PasosEscalera;
const bloqueosV = porcentajesV.map((p) => 100 - Math.floor(p));
const numParticulasVen = 80;
const numParticulasCo = 80;
const numParticulasI = 80;
let reloj = 0;
/**
 * Según el Plan Decenal de Salud el 95 % de las mujeres gestantes debe tener cuatro o más controles prenatales.
Según la meta de los Objetivos de Desarrollo Sostenible (ODS), para el 2030, el 93 % de las gestantes debe tener cuatro o más controles prenatales
 */
const umbralPlanDecenal = 95;
const porcentajeColombianas2023 = 76.08;
//nacieron = 510908;
const datosControlesC: PasosEscalera = [623715, 623715, 623715, 441340];
const porcentajesC: PasosEscalera = [100, 100, 100, porcentajeColombianas2023];
const porcentajesIdeal: PasosEscalera = [100, 100, 100, umbralPlanDecenal];

const nombresSecciones = [
  'Mujeres Embarazadas',
  'Regularizadas',
  'Afiliadas al sistema de salud',
  'Con 4 controles prenatales',
];

const textosLineas = {
  venezolanas: {
    texto:
      'Las mujeres venezolanas embarazadas en Colombia tienen muchas dificultades para acceder a los servicios de salud y llegar al ideal de los 4 controles prenatales.',
    datos: {},
    fondo: 'rgba(176, 15, 201, 0.396)',
  },
  colombianas: {
    texto:
      'A pesar de que el 100% de las mujeres embarazadas colombianas están afiliadas al sistema de salud, no todas logran llegar a los 4 controles prenatales.',
    datos: {},
    fondo: 'rgba(17, 141, 157, 0.396)',
  },
  ideal: {
    texto:
      'El Plan Decenal de Salud establece que el 95% de las mujeres embarazadas deben tener 4 o más controles prenatales. La meta de los ODS es del 93% para el 2030.',
    datos: {},
    fondo: 'rgba(59, 157, 17, 0.396)',
  },
};

const textosSecciones = [
  {
    titulo: 'Mujeres Embarazadas',
    texto: `En Colombia hay ${formatoNumero.format(datosControlesV[0])} Venezolanas embarazadas.`,
  },

  {
    titulo: 'Mujeres Embarazadas y Regularizadas',
    texto: `De las ${formatoNumero.format(datosControlesV[0])} Venezolanas embarazadas, <span class="resaltar">${porcentajesV[1]}%</span> están regularizadas. La meta debería ser del <span class="resaltar ideal">${porcentajesIdeal[1]}%</span>.`,
  },
  {
    titulo: 'Afiliadas al sistema de salud',
    texto: `De las ${formatoNumero.format(datosControlesV[0])} Venezolanas embarazadas, <span class="resaltar alerta">${porcentajesV[2]}%</span> están afiliadas al sistema de salud. La meta debería ser del <span class="resaltar ideal">${porcentajesIdeal[2]}%</span>.`,
  },
  {
    titulo: 'Con 4 controles prenatales',
    texto: `De las ${formatoNumero.format(datosControlesV[0])} Venezolanas embarazadas, <span class="resaltar alerta">${porcentajesV[3]}%</span> han tenido 4 o más controles prenatales. Hay una gran brecha de <span class="resaltar alerta">${porcentajesIdeal[3] - porcentajesV[3]}%</span> con el ideal del Plan Decenal de Salud que indica que debería ser mínimo del <span class="resaltar ideal">${porcentajesIdeal[3]}%</span>.`,
  },
];

onMounted(() => {
  numeroSecciones.value = porcentajesV.length;
  escalar();

  reloj = requestAnimationFrame(animar);
  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  cancelAnimationFrame(reloj);
  window.removeEventListener('resize', escalar);
});

function construirLinea(datos: PasosEscalera) {
  if (!grafica.value) return;
  const secciones = numeroSecciones.value;
  const { ancho, anchoSeccion, centroMonte, piso } = dims.value;
  /** La inclinación debe ser 3 o más: números bajitos para hacer las montañas más empinadas, número alto para hacer las montañas menos empinadas (más gorditas) */
  const inclinacion = 6;
  const margenXSeccion = anchoSeccion / inclinacion;
  const punto0 = { x: 0, y: piso };
  let x = punto0.x;

  // esquina superior izquierda
  let linea = `M 0 0 0 ${piso} `;
  // izquierda y piso: punto de inicio
  linea += `${x + margenX} ${punto0.y} `;

  const datosLinea: [x: number, y: number][] = [];
  x = margenX;

  for (let i = 0; i < secciones; i++) {
    const x1 = x + margenXSeccion;
    const x2 = x + centroMonte;
    const y2 = posY(datos[i]);
    const x3 = x + anchoSeccion - margenXSeccion;
    linea += `${x1} ${piso} ${x2} ${y2} ${x3} ${piso} `;
    datosLinea.push([x1, piso], [x2, y2], [x3, piso]);
    x += anchoSeccion;
  }

  linea += `${margenX + ancho} ${piso} 0 ${piso}`;
  datosLinea.push([margenX + ancho, piso]);
  return { linea, datos: datosLinea };
}

function escalar() {
  if (!grafica.value) return;
  const svg = grafica.value;
  const contenedor = svg.parentElement;

  if (contenedor) {
    const { clientWidth: ancho, clientHeight: alto } = contenedor;
    svg.setAttribute('width', `${ancho}`);
    svg.setAttribute('height', `${alto}`);

    const anchoGrafica = ancho - margenX * 2;
    const anchoSeccion = anchoGrafica / numeroSecciones.value;
    const margenY = 50;
    const piso = alto - margenY;
    dims.value = {
      anchoTotal: ancho,
      altoTotal: alto,
      piso,
      techo: margenY,
      ancho: anchoGrafica,
      alto: piso * 2,
      anchoSeccion,
      centroMonte: anchoSeccion / 2,
    };

    const venezolanas = construirLinea(porcentajesV);
    const colombianas = construirLinea(porcentajesC);
    const ideal = construirLinea(porcentajesIdeal);

    if (venezolanas && colombianas && ideal) {
      lineaV.value = venezolanas.linea;
      lineaC.value = colombianas ? colombianas.linea : '';
      lineaI.value = ideal ? ideal.linea : '';
      const personajes: Particula[] = [];
      const limites: PuntoSimple = [ancho - margenX, piso];
      let iBloqueos = 0;

      for (let i = 0; i < numParticulasVen; i++) {
        if (i >= bloqueosV[iBloqueos]) {
          iBloqueos++;
        }

        personajes.push(
          new Particula(
            'venezolana',
            numeroAleatorio(-margenX, margenX),
            piso,
            numeroAleatorio(1, 4),
            [margenX, piso],
            limites, //[anchoSeccion * iBloqueos + margenX, piso],
            venezolanas.datos
          )
        );
      }

      for (let i = 0; i < numParticulasCo; i++) {
        personajes.push(
          new Particula(
            'colombiana',
            numeroAleatorio(-margenX, margenX),
            piso,
            numeroAleatorio(1, 4),
            [margenX, margenY],
            [ancho - margenX, margenY],
            colombianas.datos
          )
        );
      }

      for (let i = 0; i < numParticulasI; i++) {
        personajes.push(
          new Particula(
            'ideal',
            numeroAleatorio(-margenX, margenX),
            piso,
            numeroAleatorio(1, 4),
            [margenX, margenY],
            [ancho - margenX, margenY],
            ideal.datos
          )
        );
      }

      particulas.value = personajes;
    }
  }
}
function animar() {
  if (!mujeres.value) return;

  mujeres.value.forEach((mujer, i) => {
    const particula = particulas.value[i];
    let desplazar = 'translateY(-10px)';

    if (particula.tipo === 'colombiana') {
      desplazar = 'translate(10px, -30px)';
    }

    if (particula.tipo === 'venezolana') {
      desplazar = 'translate(20px, -50px)';
    }

    Object.assign(mujer.style, {
      left: `${particula.x}px`,
      top: `${particula.y}px`,
      transform: `${desplazar} rotate(${particula.angulo}rad)`,
    });
    particula.mover();
  });

  reloj = requestAnimationFrame(animar);
}

function infoLinea(tipo: TiposMujeres | null) {
  if (!info.value) return;
  if (!tipo) {
    info.value.innerHTML = '';
    mostrarInfo.value = false;
    return;
  }
  mostrarInfo.value = true;
  info.value.style.backgroundColor = textosLineas[tipo].fondo;
  info.value.innerHTML = textosLineas[tipo].texto;
}

function infoSeccion(i: number | null) {
  if (!info.value) return;

  if (i === null) {
    // info.value.innerHTML = '';
    mostrarInfo.value = false;
    return;
  }
  mostrarInfo.value = true;
  info.value.style.backgroundColor = 'rgb(255 255 255 / 97%)';
  info.value.innerHTML = textosSecciones[i].texto;
}

function posInfo(evento: MouseEvent) {
  evento.stopImmediatePropagation();
  if (!info.value) return;
  const { clientX, clientY } = evento;
  const { height } = info.value.getBoundingClientRect();
  const x = clientX;
  const y = clientY - height - 20;
  info.value.style.left = `${x}px`;
  info.value.style.top = `${y}px`;
}
</script>

<template>
  <div id="contenedor" @mousemove="posInfo">
    <svg class="montes" ref="grafica">
      <defs>
        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stop-color="rgb(244, 126, 130)" />
          <stop offset="100%" stop-color="rgb(162, 232, 197)" />
        </linearGradient>
      </defs>

      <g
        v-for="i in numeroSecciones"
        class="areaEscalon"
        :style="{ transform: `translate(${margenX + dims.anchoSeccion * (i - 1)}px, 0)` }"
        @click="irASeccion(i - 1)"
        @mouseenter="infoSeccion(i - 1)"
        @mouseleave="infoSeccion(null)"
      >
        <rect class="zona" :x="0" y="0" :width="`${dims.anchoSeccion}px`" height="100%" />
        <text x="10px" y="20px">{{ nombresSecciones[i - 1] }}</text>
      </g>

      <g style="transform: translate(20px, -40px)">
        <rect
          class="leyenda venezolana"
          x="0"
          :y="`${dims.piso - 20}px`"
          width="80"
          height="20"
          @mouseenter="infoLinea('venezolanas')"
          @mouseleave="infoLinea(null)"
        ></rect>
        <text class="nombreGrupo" x="10px" :y="`${dims.piso - 3}px`">Venezolanas</text>
        <InfoMonte :dims="dims" :margenX="margenX" :porcentajes="porcentajesV" :linea="lineaV" :pos-y="posY" />
        <path v-if="lineaV.length" class="lineaRecorrido" :d="lineaV" fill="url(#color)"></path>
      </g>

      <g style="transform: translate(10px, -20px)">
        <rect
          class="leyenda colombiana"
          x="0"
          :y="`${dims.piso - 20}px`"
          width="90"
          height="20"
          @mouseenter="infoLinea('colombianas')"
          @mouseleave="infoLinea(null)"
        ></rect>
        <text class="nombreGrupo" x="10px" :y="`${dims.piso - 3}px`">Colombianas</text>
        <InfoMonte :dims="dims" :margenX="margenX" :porcentajes="porcentajesC" :linea="lineaV" :pos-y="posY" />
        <path v-if="lineaC.length" class="lineaRecorrido" :d="lineaC" fill="url(#color)"></path>
      </g>

      <g style="transform: translate(0, 0)">
        <rect
          class="leyenda ideal"
          x="0"
          :y="`${dims.piso - 20}px`"
          width="100"
          height="20"
          @mouseenter="infoLinea('ideal')"
          @mouseleave="infoLinea(null)"
        ></rect>
        <text class="nombreGrupo" x="10px" :y="`${dims.piso - 3}px`">Ideal</text>
        <InfoMonte :dims="dims" :margenX="margenX" :porcentajes="porcentajesIdeal" :linea="lineaV" :pos-y="posY" />
        <path v-if="lineaC.length" class="lineaRecorrido" :d="lineaI" fill="url(#color)"></path>
      </g>
    </svg>

    <div id="contenedorAnim">
      <span
        v-for="(particula, i) in particulas"
        ref="mujeres"
        :key="`particula${i}`"
        :class="`mujer ${particula.tipo}`"
      ></span>
    </div>
    <div id="info" ref="info" :class="{ visible: mostrarInfo }"></div>
  </div>
</template>

<style lang="scss" scoped>
#contenedor {
  position: sticky;
  top: 100px;
}

#info {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  background-color: #a3bcd2f7;
  padding: 1em;
  pointer-events: none;
  display: none;
  border: 1px solid black;
  // display: block;

  &.visible {
    display: block;
  }
}

.leyenda {
  cursor: pointer;
  fill: rgba(176, 15, 201, 0.396);

  &.colombiana {
    fill: rgba(17, 141, 157, 0.396);
  }

  &.ideal {
    fill: rgba(59, 157, 17, 0.396);
  }
}

#contenedorAnim {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f0f8ff3b;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.montes {
  height: 50vh;
}

.mujer {
  width: 8px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background-color: rgba(176, 15, 201, 0.396);
  position: absolute;

  &.colombiana {
    background-color: rgba(17, 141, 157, 0.396);
  }

  &.ideal {
    background-color: rgba(59, 157, 17, 0.396);
  }
}

.lineaRecorrido {
  stroke: rgba(33, 24, 33, 0.5);
  stroke-width: 0.5;
  height: 150px;
  background: linear-gradient(to right, rgb(244, 126, 130), rgb(162, 232, 197) 100%);
}

.nombreGrupo {
  font-size: 0.85em;
  pointer-events: none;
}

.areaEscalon {
  cursor: pointer;

  .zona {
    fill: rgba(241, 241, 240, 0.31);
    stroke: black;
    stroke-width: 0.1;
  }

  &:hover {
    .zona {
      fill: rgba(241, 241, 240, 1);
    }
  }
}
</style>
