<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import type { DatosBuscador, DatosInclusion } from '../../../../tiposCompartidos/compartidos';
import { computed, ref, type Ref } from 'vue';
import Buscador from './Buscador.vue';
import { colorMax, colorMedio, colorMin } from '@/cerebros/constantes';
import { escalaColores } from '@/utilidades/ayudas';
import { storeToRefs } from 'pinia';
import mapbox, { type Map } from 'mapbox-gl';

interface Esquema {
  mapa: Map | null;
}
const props = defineProps<Esquema>();

type OrdenLista = 'ascendente' | 'descendente' | 'alfabetico';
const cerebroDatos = usarCerebroDatos();
const orden: Ref<OrdenLista> = ref('descendente');
const listaLugares: Ref<HTMLUListElement | null> = ref(null);
const { datosA, datosD, datosABC, lugaresSeleccionados } = storeToRefs(cerebroDatos);
const marcaMapa: Ref<HTMLDivElement | null> = ref(null);

const coloresAltos = escalaColores(20, 50, colorMax, colorMedio, 0.4);
const coloresBajos = escalaColores(50, 100, colorMedio, colorMin, 0.4);
const esVisible = ref(false);

const datos = computed<DatosInclusion[]>(() => {
  if (orden.value === 'ascendente') return datosA.value;
  else if (orden.value === 'descendente') return datosD.value;
  return datosABC.value;
});

function color(indice: number) {
  if (indice >= 50) return coloresBajos(indice);
  return coloresAltos(indice);
}

function buscarColor(id: number) {
  const municipio = datos.value.find((lugar) => lugar.id === id);

  if (municipio) {
    return color(municipio.valorIndice);
  }
}

function ordenarLista(criterioOrden: OrdenLista) {
  orden.value = criterioOrden;
}

function actualizarSeleccionados(datosLugar: { id?: number; nombre: string }) {
  const indice = lugaresSeleccionados.value.findIndex((obj) => {
    return obj.id === datosLugar.id;
  });

  if (lugaresSeleccionados.value.length >= 4) {
    esVisible.value = true;
  }

  if (indice < 0) {
    if (lugaresSeleccionados.value.length < 4) {
      cerebroDatos.seleccionarLugar({
        id: datosLugar.id as number,
        nombre: datosLugar.nombre,
      });
    } else {
      cerebroDatos.seleccionarLugar({
        id: datosLugar.id as number,
        nombre: datosLugar.nombre,
      });
    }
  } else {
    //console.log('ya existe');
  }

  if (indice > -1) {
    cerebroDatos.lugaresSeleccionados.splice(indice, 1);
    esVisible.value = false;
  }
}

// let marca: mapbox.Marker | null = null;

function previsualizarLugar(lugar?: DatosInclusion) {
  if (!lugar && props.mapa) {
    props.mapa.setFilter('capa-municipios', null);
    marcaMapa.value?.classList.add('oculto');
    return;
  }

  if (!lugar || !props.mapa || !cerebroDatos.geojson || !marcaMapa.value) return;

  const { mapa } = props;
  const datosLugar = cerebroDatos.geojson.features.find((l) => l.properties.id === lugar.id);

  if (datosLugar) {
    mapa.setFilter('capa-municipios', ['==', 'id', lugar.id]);
    const [long, lat] = datosLugar.geometry.coordinates[0][0];
    if (!long || !lat) return;
    const longitud = Array.isArray(long) ? long[0] : long;
    const latitud = Array.isArray(lat) ? lat[1] : lat;
    const { x, y } = mapa.project([longitud, latitud]);
    const contenedorMapa = document.getElementById('contenedorGeneral');
    if (!contenedorMapa) return;
    const { left, top } = contenedorMapa.getBoundingClientRect();
    console.log(`Pixel coordinates: x=${x}, y=${y}`);
    marcaMapa.value.innerHTML =
      `<p class="nombreMunicipio">${lugar.nombre} (${lugar.dep})</p>` +
      `<span class="infoLeyenda">Tasa de afiliación:</span> ${datosLugar.properties.valorIndice.toFixed(2)}`;
    marcaMapa.value.style.left = `${x + left}px`;
    marcaMapa.value.style.top = `${y + top}px`;
    marcaMapa.value?.classList.remove('oculto');
  }
}
</script>

<template>
  <section id="contenedorIndice" class="seccionCentro" ref="contenedorIndice">
    <h2 class="tituloSeccion centrado">Tasa de afiliación</h2>

    <div id="buscadoresBotones" class="centrado">
      <Buscador />

      <div id="ordenarPor">
        <span
          class="botonFiltro descendente"
          :class="`${orden === 'descendente' ? 'activo' : ''}`"
          @click="ordenarLista('descendente')"
          title="Ranking descendente"
        ></span>
        <span
          class="botonFiltro ascendente"
          :class="`${orden === 'ascendente' ? 'activo' : ''}`"
          @click="ordenarLista('ascendente')"
          title="Ranking ascendente"
        ></span>
        <span
          class="botonFiltro alfabetico"
          :class="`${orden === 'alfabetico' ? 'activo' : ''}`"
          @click="ordenarLista('alfabetico')"
          title="Alfabético"
        ></span>
      </div>
    </div>

    <!-- <div id="seleccionados" ref="seleccionados" class="centrado">
      <span
        v-for="i = 0 in 4"
        :key="`pildora${i}`"
        :class="`${lugaresSeleccionados[i - 1] ? 'pildora lugarElegido' : 'pildora'}`"
        @click="actualizarSeleccionados(lugaresSeleccionados[i - 1])"
        :style="`background-color:${lugaresSeleccionados[i - 1] ? buscarColor(lugaresSeleccionados[i - 1].id) : 'transparent'}`"
        @mouseover="previsualizarLugar(lugaresSeleccionados[i - 1])"
      >
        {{ lugaresSeleccionados[i - 1] ? lugaresSeleccionados[i - 1].nombre : '' }}</span
      >
    </div> -->

    <ul class="listaLugares" ref="listaLugares">
      <li
        v-for="(elemento, i) in datos"
        :key="`${elemento.nombre}-${i}`"
        :id="`mun${elemento.id}`"
        class="lugar"
        :class="`${lugaresSeleccionados.length && lugaresSeleccionados.find((lugar) => lugar.id === elemento.id) ? ' activo' : ''}`"
        @click="actualizarSeleccionados(elemento)"
        @mouseenter="previsualizarLugar(elemento)"
        @mouseleave="previsualizarLugar()"
        :style="`background-color:${color(elemento.valorIndice)}`"
      >
        <span class="valor">{{ elemento.valorRank }}. </span>
        <span class="municipio">{{ elemento.nombre }}</span>
        <span class="departamento">, {{ elemento.dep }}</span>
        <span class="valor">: {{ elemento.valorIndice.toFixed(2) }}</span>
      </li>
    </ul>
  </section>

  <div id="marcaMapa" ref="marcaMapa"></div>
</template>

<style lang="scss" scoped>
h2 {
  margin-bottom: 0.8em;
}
#marcaMapa {
  position: fixed;
  z-index: 99;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
  border-radius: 5px;
  transform: translate(-50%, -100%);

  &.oculto {
    display: none;
  }
}

#contenedorIndice {
  overflow: hidden;
  background-color: var(--naranja);
}

#avisoInstrucciones {
  display: none;
  z-index: 99;
  position: absolute;
  left: 37%;
  top: 45vh;
  background-color: var(--rosado);
  color: var(--negro);
  padding: 6em;
  border: 1px solid black;
  border-radius: 20px;
  cursor: pointer;

  &.visible {
    display: block;
  }
}

.instrucciones {
  text-align: left;
}

#seleccionados {
  display: flex;
  align-items: flex-start;

  .pildora {
    border: black 1px dashed;
    border-radius: 10px;
    margin: 0.5em 0.5em 0.5em 0;
    padding: 0.2em 0.3em;
    min-height: 1.5em;
    min-width: 21%;
    font-size: 0.9em;
    text-align: center;

    &:hover {
      background-color: var(--amarilloClaro);
    }

    &.lugarElegido {
      border: black 1px solid;
      height: fit-content;
      width: fit-content;
      min-width: 22%;
      cursor: pointer;
    }
  }
}

#buscadoresBotones {
  display: flex;
  margin-bottom: 0.5em;

  #ordenarPor {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0 10px;
    align-items: center;
    gap: 6px;

    .botonFiltro {
      cursor: pointer;
      background-color: var(--negro);
      color: var(--blanco);
      transition: opacity 0.25s ease-in-out;

      &:hover {
        opacity: 0.6;
      }
    }

    .alfabetico {
      background-image: url(/imgs/boton_alfabetico_2.svg);
      background-repeat: no-repeat;
      margin: 0;
      height: 39px;
      width: 47px;
      border-radius: 3px;

      &.activo {
        background-image: url(/imgs/boton_alfabetico.svg);
      }
    }

    .ascendente {
      background-image: url(/imgs/boton_subir.svg);
      background-repeat: no-repeat;
      margin: 0;
      height: 39px;
      width: 40px;
      border-radius: 3px;

      &.activo {
        background-image: url(/imgs/boton_subir_2.svg);
      }
    }

    .descendente {
      background-image: url(/imgs/boton_bajar.svg);
      background-repeat: no-repeat;
      margin: 0;
      height: 39px;
      width: 40px;
      border-radius: 3px;

      &.activo {
        background-image: url(/imgs/boton_bajar_2.svg);
      }
    }
  }
}

.listaLugares {
  list-style: none;
  margin: 0;
  padding: 0.3em 0 0.5em 0;
  overflow-y: auto;
  position: relative;
  height: 70vh;
}

.lugar {
  cursor: pointer;
  padding: 0 1.75em;

  &:hover {
    background-color: rgb(29, 47, 58) !important;
    color: white;
  }

  &.activo {
    // background-color: var(--negro) !important;
    // color: white;
    border: 2px solid;
  }
}

.departamento {
  font-style: italic;
}

.valor {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
