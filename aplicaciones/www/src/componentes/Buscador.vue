<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import fuzzysort from 'fuzzysort';
import { usarCerebroDatos } from '@/cerebros/datos';
import { storeToRefs } from 'pinia';

const buscador: Ref<HTMLInputElement | undefined> = ref();
const sugerencias: Ref<string[]> = ref(['']);
const fuenteBusqueda: Ref<{ nombre: string }[]> = ref([]);
const cerebroDatos = usarCerebroDatos();
const { datos } = storeToRefs(cerebroDatos);
let sugerencia: { id: number; nombre: string; dep: string } | undefined;

watch(datos, () => {
  if (fuenteBusqueda.value.length) return;

  fuenteBusqueda.value = datos.value;
  llenarBaseLista();
});

function buscar() {
  const texto = buscador.value?.value;

  if (!texto || !texto.length) {
    llenarBaseLista();
    return;
  }

  const busqueda = fuzzysort.go(texto, fuenteBusqueda.value, { key: 'nombre' });

  if (busqueda.total > 0) {
    sugerencias.value = [];

    busqueda.forEach((valor) => {
      const indiceSugerencia = fuenteBusqueda.value.findIndex((mun) => mun.nombre === valor.obj.nombre);
      sugerencia = {
        id: cerebroDatos.datos[indiceSugerencia].id as number,
        nombre: cerebroDatos.datos[indiceSugerencia].nombre,
        dep: cerebroDatos.datos[indiceSugerencia].dep,
      };
      if (sugerencia) sugerencias.value.push(sugerencia.nombre);
    });
  }
}

function elegirLugar() {
  if (!sugerencia) return;
  if (cerebroDatos.lugaresSeleccionados.length < 4) {
    cerebroDatos.lugaresSeleccionados.push({ id: sugerencia.id, nombre: sugerencia.nombre });
  }
}

function llenarBaseLista() {
  sugerencias.value = [];

  fuenteBusqueda.value.forEach((mun) => {
    sugerencias.value.push(mun.nombre);
  });
}
</script>

<template>
  <div id="contenedorBuscador">
    <input
      id="buscador"
      ref="buscador"
      type="search"
      name="nombreMunicipio"
      placeholder="Buscar Municipio"
      list="sugerencias"
      @input="buscar"
      @change="elegirLugar"
    />

    <datalist id="sugerencias">
      <option v-for="opcion in sugerencias" :value="opcion"></option>
    </datalist>
  </div>
</template>

<style>
#contenedorBuscador {
  width: 60%;
  border-color: transparent;
}
#buscador {
  padding: 10px;
  width: 100%;
  height: 39px;
  font-family: var(--fuenteParrafo);
  border: 2.5px solid var(--naranja2);
  color: var(--negro);
}

option {
  display: block !important;
}
</style>
