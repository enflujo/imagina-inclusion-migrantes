<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import type { DatosInclusion } from 'tipos/compartidos';
import { onMounted, ref, type Ref } from 'vue';
import Buscador from './Buscador.vue';
type OrdenLista = 'ascendente' | 'descendente' | 'alfabetico';
const cerebroDatos = usarCerebroDatos();
const datos: Ref<DatosInclusion[]> = ref([]);
const orden: Ref<OrdenLista> = ref('ascendente');

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

function actualizarSeleccionados(id: number) {
  const indice = cerebroDatos.lugaresSeleccionados.indexOf(id);
  if (indice > -1) {
    cerebroDatos.lugaresSeleccionados.splice(indice, 1);
  } else {
    if (cerebroDatos.lugaresSeleccionados.length <= 3) {
      cerebroDatos.lugaresSeleccionados.push(id);
    }
  }
}
</script>

<template>
  <section id="contenedorIndice" class="seccionCentro">
    <h2>Índice de inclusión</h2>

    <Buscador />

    <div id="ordenarPor">
      <span
        class="botonFiltro alfabetico"
        :class="`${orden === 'alfabetico' ? 'activo' : ''}`"
        @click="ordenarLista('alfabetico')"
        >Alfabético</span
      >
      <span
        class="botonFiltro ascendente"
        :class="`${orden === 'ascendente' ? 'activo' : ''}`"
        @click="ordenarLista('ascendente')"
        >Ranking ascendente</span
      >
      <span
        class="botonFiltro descendente"
        :class="`${orden === 'descendente' ? 'activo' : ''}`"
        @click="ordenarLista('descendente')"
        >Ranking descendente</span
      >
    </div>

    <ul class="listaLugares">
      <li
        v-for="(elemento, i) in datos"
        :key="`${elemento.nombre}-${i}`"
        class="lugar"
        :class="`${cerebroDatos.lugaresSeleccionados.includes(elemento.id) ? ' activo' : ''}`"
        @click="actualizarSeleccionados(elemento.id as number)"
      >
        <span class="municipio">{{ elemento.nombre }}</span>
        <span class="departamento">, {{ elemento.dep }}</span>
        <span class="valor">: {{ elemento.valorRank }}</span>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
#contenedorIndice {
  overflow: hidden;
}

#ordenarPor {
  display: flex;
  justify-content: space-between;
  margin: 1em 0;

  .botonFiltro {
    cursor: pointer;
    background-color: black;
    color: white;
    padding: 5px;
    transition: opacity 0.25s ease-in-out;

    &:hover {
      opacity: 0.6;
    }

    &.activo {
      background-color: var(--naranja2);
    }
  }
}

.listaLugares {
  list-style: none;
  margin: 1.5em 0 0 0;
  padding: 0;
  max-height: 60%;
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
