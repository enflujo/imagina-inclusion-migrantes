<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import type { DatosBuscador, DatosInclusion } from 'tipos/compartidos';
import { computed, onMounted, ref, type Ref } from 'vue';
import Buscador from './Buscador.vue';
import { colorMax, colorMedio, colorMin } from '@/cerebros/constantes';
import { escalaColores } from '@/utilidades/ayudas';

type OrdenLista = 'ascendente' | 'descendente' | 'alfabetico';
const cerebroDatos = usarCerebroDatos();
const datos: Ref<DatosInclusion[]> = ref([]);
const orden: Ref<OrdenLista> = ref('ascendente');
const listaLugares: Ref<HTMLUListElement | null> = ref(null);

const lugares = computed(() => cerebroDatos.lugaresSeleccionados);
const coloresAltos = escalaColores(20, 50, colorMax, colorMedio, 0.4);
const coloresBajos = escalaColores(50, 100, colorMedio, colorMin, 0.4);

function color(indice: number) {
  if (indice >= 50) return coloresBajos(indice);
  return coloresAltos(indice);
}

function buscarColor(id: number) {
  const municipio = cerebroDatos.datos.find((lugar) => lugar.id === id);

  if (municipio) {
    return color(municipio.valorIndice);
  }
}

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  datos.value = cerebroDatos.datos;
  ordenarLista(orden.value);
});

function ordenarLista(criterioOrden: OrdenLista) {
  orden.value = criterioOrden;
  if (criterioOrden === 'ascendente') datos.value.sort((a, b) => a.valorRank - b.valorRank);
  else if (criterioOrden === 'descendente') datos.value.sort((a, b) => b.valorRank - a.valorRank);
  else if (criterioOrden === 'alfabetico') {
    datos.value.sort((a, b) => {
      if (a.nombre < b.nombre) return -1;
      if (a.nombre > b.nombre) return 1;
      return 0;
    });
  }
}

function actualizarSeleccionados(datosLugar: { id?: number; nombre: string }) {
  const lugaresSeleccionados = cerebroDatos.lugaresSeleccionados;
  const indice = lugaresSeleccionados.findIndex((obj) => obj.id === datosLugar.id);

  if (indice > -1) {
    cerebroDatos.lugaresSeleccionados.splice(indice, 1);
  } else {
    if (lugaresSeleccionados.length <= cerebroDatos.limiteLugares - 1) {
      cerebroDatos.lugaresSeleccionados.push({
        id: datosLugar.id as number,
        nombre: datosLugar.nombre,
      });
    }
  }
}

function previsualizarLugar(lugar: DatosBuscador) {
  if (!listaLugares.value) return;

  const posY = listaLugares.value.querySelector<HTMLLIElement>(`#mun${lugar.id}`)?.offsetTop;

  listaLugares.value.scrollTo({
    top: posY,
    behavior: 'smooth',
  });
}
</script>

<template>
  <section id="contenedorIndice" class="seccionCentro">
    <h2 class="tituloSeccion centrado">Índice de inclusión</h2>

    <div id="buscadoresBotones" class="centrado">
      <Buscador />

      <div id="ordenarPor">
        <span
          class="botonFiltro alfabetico"
          :class="`${orden === 'alfabetico' ? 'activo' : ''}`"
          @click="ordenarLista('alfabetico')"
          title="Alfabético"
        ></span>
        <span
          class="botonFiltro ascendente"
          :class="`${orden === 'ascendente' ? 'activo' : ''}`"
          @click="ordenarLista('ascendente')"
          title="Ranking ascendente"
        ></span>
        <span
          class="botonFiltro descendente"
          :class="`${orden === 'descendente' ? 'activo' : ''}`"
          @click="ordenarLista('descendente')"
          title="Ranking descendente"
        ></span>
      </div>
    </div>

    <div id="seleccionados" ref="seleccionados" class="centrado">
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`lugar${i}`"
        class="lugarElegido"
        @click="actualizarSeleccionados(lugar)"
        :style="`background-color:${buscarColor(lugar.id)}`"
        @mouseover="previsualizarLugar(lugar)"
      >
        {{ lugar.nombre }}</span
      >
    </div>

    <ul class="listaLugares" ref="listaLugares">
      <li
        v-for="(elemento, i) in datos"
        :key="`${elemento.nombre}-${i}`"
        :id="`mun${elemento.id}`"
        class="lugar"
        :class="`${lugares.length && lugares.find((lugar) => lugar.id === elemento.id) ? ' activo' : ''}`"
        @click="actualizarSeleccionados(elemento)"
        :style="`background-color:${color(elemento.valorIndice)}`"
      >
        <span class="municipio">{{ elemento.nombre }}</span>
        <span class="departamento">, {{ elemento.dep }}</span>
        <span class="valor">: {{ elemento.valorIndice.toFixed(2) }}</span>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
h2 {
  margin-bottom: 0.8em;
}

#contenedorIndice {
  max-height: 60vh;
  overflow: hidden;
  background-color: var(--naranja);
}

#seleccionados {
  display: flex;
  align-items: flex-start;

  .lugarElegido {
    border: black 1px solid;
    border-radius: 10px;
    margin: 0.5em 0.5em 0.5em 0;
    padding: 0.2em 0.3em;
    cursor: pointer;

    &:hover {
      background-color: var(--amarilloClaro);
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
  height: 38vh;
  overflow-y: auto;
  position: relative;
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
