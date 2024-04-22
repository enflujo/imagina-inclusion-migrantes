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
      const sugerencia = fuenteBusqueda.value.find((mun) => mun.nombre === valor.obj.nombre);
      if (sugerencia) sugerencias.value.push(sugerencia.nombre);
    });
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
    />

    <datalist id="sugerencias">
      <option v-for="opcion in sugerencias" :value="opcion"></option>
    </datalist>
  </div>
</template>

<style>
option {
  display: block !important;
}
</style>
