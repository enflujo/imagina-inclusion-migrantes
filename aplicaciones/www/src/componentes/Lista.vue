<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import type { DatosInclusion } from 'tipos/compartidos';
import { computed, onMounted, ref, type Ref } from 'vue';
import Buscador from './Buscador.vue';
type OrdenLista = 'ascendente' | 'descendente' | 'alfabetico';
const cerebroDatos = usarCerebroDatos();
const datos: Ref<DatosInclusion[]> = ref([]);
const orden: Ref<OrdenLista> = ref('ascendente');
const lugares = computed(() => cerebroDatos.lugaresSeleccionados);

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  datos.value = cerebroDatos.datos;
  ordenarLista(orden.value);
  cerebroDatos.lugaresSeleccionados.push({ id: datos.value[0].id as number, nombre: datos.value[0].nombre });
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
    if (lugaresSeleccionados.length <= 3) {
      cerebroDatos.lugaresSeleccionados.push({
        id: datosLugar.id as number,
        nombre: datosLugar.nombre,
      });
    }
  }
}
</script>

<template>
  <section id="contenedorIndice" class="seccionCentro">
    <h2>Índice de inclusión</h2>

    <div id="buscadoresBotones">
      <Buscador />

      <div id="ordenarPor">
        <span
          class="botonFiltro alfabetico"
          :class="`${orden === 'alfabetico' ? 'activo' : ''}`"
          @click="ordenarLista('alfabetico')"
          title="Alfabético"
          >Alfabético</span
        >
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

    <div id="seleccionados" ref="seleccionados">
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`lugar${i}`"
        class="lugarElegido"
        @click="actualizarSeleccionados(lugar)"
      >
        {{ lugar.nombre }}</span
      >
    </div>

    <div id="seleccionados" ref="seleccionados">
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`lugar${i}`"
        class="lugarElegido"
        @click="actualizarSeleccionados(lugar)"
      >
        {{ lugar.nombre }}</span
      >
    </div>

    <ul class="listaLugares">
      <li
        v-for="(elemento, i) in datos"
        :key="`${elemento.nombre}-${i}`"
        class="lugar"
        :class="`${lugares.length && lugares.find((lugar) => lugar.id === elemento.id) ? ' activo' : ''}`"
        @click="actualizarSeleccionados(elemento)"
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
}

#seleccionados {
  display: flex;
  align-items: flex-start;

  .lugarElegido {
    border: black 1px solid;
    border-radius: 10px;
    margin: 0 0.5em 0 0;
    padding: 0.2em 0.3em;
    cursor: pointer;

    &:hover {
      background-color: var(--amarilloClaro);
    }
  }
}

#buscadoresBotones {
  display: flex;

  #ordenarPor {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0 10px;
    align-items: center;
    gap: 6px;

    .botonFiltro {
      cursor: pointer;
      background-color: black;
      color: white;

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
      background-color: transparent;
      color: transparent;
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
      background-color: transparent;
      color: transparent;
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
      background-color: transparent;
      color: transparent;
      border-radius: 3px;

      &.activo {
        background-image: url(/imgs/boton_bajar_2.svg);
      }
    }
  }
}

.listaLugares {
  list-style: none;
  margin: 1.3em 0 0 0;
  padding: 0 0 7em 0;
  max-height: 40vh;
  overflow-y: scroll; /* Add the ability to scroll */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .scroll-container::-webkit-scrollbar {
    display: none;
  }
}

.lugar {
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 241, 163, 0.5);
  }

  &.activo {
    background-color: var(--amarillo);
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
