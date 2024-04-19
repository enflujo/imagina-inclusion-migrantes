<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import fuzzysort from 'fuzzysort';
import { pedirDatos } from '@/utilidades/ayudas';
import type { DatosInclusion } from 'tipos/compartidos';
const datos = await pedirDatos<DatosInclusion[]>('/inclusion-municipios.json');

const buscador: Ref<HTMLInputElement | undefined> = ref();
const sugerencias: Ref<string[]> = ref(['']);
let fuenteBusqueda: { nombre: string}[];

fuenteBusqueda = datos;

llenarBaseLista();

function actualizarSugerencias() {
  console.log('estoy en el evento onChange');
  
}

function buscar() {
  console.log('estoy en el evento onInput', buscador.value?.value);
  const texto = buscador.value?.value;
  if (!texto || !texto.length) {
    llenarBaseLista();
    return;
  }

  const busqueda = fuzzysort.go(texto, fuenteBusqueda, { key: 'nombre' });

  if (busqueda.total > 0) {
    sugerencias.value = [];
    busqueda.forEach((valor) => {
      const sugerencia = datos.find((mun) => mun.nombre === valor.obj.nombre);
      if (sugerencia) sugerencias.value.push(sugerencia.nombre);
    });
    console.log(sugerencias.value);
  }
}

function llenarBaseLista() {
  onMounted(() => {
    datos.forEach((mun) => {
      sugerencias.value.push(mun.nombre);
    });
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
      @change="actualizarSugerencias"
    />

    <datalist id="sugerencias">
      <option v-for="opcion in sugerencias" :value="opcion"></option>
    </datalist>
  </div>
</template>

<style>
option {
    display: block !important
}
</style>
