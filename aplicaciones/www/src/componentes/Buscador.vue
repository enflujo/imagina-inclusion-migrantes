<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import fuzzysort from 'fuzzysort';
import { usarCerebroDatos } from '@/cerebros/datos';
import type { DatosBuscador } from 'tipos/compartidos';

const buscador: Ref<HTMLInputElement | undefined> = ref();
const sugerencias: Ref<DatosBuscador[]> = ref([]);
const enFoco: Ref<boolean> = ref(false);
const cerebroDatos = usarCerebroDatos();

/**
 * Eventos
 */
const foco = () => (enFoco.value = true);
const fueraFoco = () => (enFoco.value = false);
const seleccionar = (lugar: DatosBuscador) => {
  if (!buscador.value) return;
  cerebroDatos.seleccionarLugar(lugar);
  buscador.value.value = lugar.nombre;
};

onMounted(async () => {
  if (!cerebroDatos.datosBuscador.length) {
    await cerebroDatos.cargarDatosBuscador();
  }

  llenarBaseLista();
});

function buscar() {
  if (!cerebroDatos.datosBuscador.length) return;
  const texto = buscador.value?.value;

  if (!texto || !texto.length) {
    llenarBaseLista();
    return;
  }

  const busqueda = fuzzysort.go(texto, cerebroDatos.datosBuscador, { key: 'nombre' });

  if (busqueda.total > 0) {
    sugerencias.value = busqueda.map((resultado) => resultado.obj);
  } else {
    sugerencias.value = [{ id: -1, nombre: 'Sin resultados' }];
  }
}

function llenarBaseLista() {
  sugerencias.value = cerebroDatos.datosBuscador;
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
      @focusin="foco"
      @focusout="fueraFoco"
    />

    <div id="sugerencias" :class="enFoco ? 'visible' : ''">
      <span
        class="opcion"
        v-for="opcion in sugerencias"
        :key="opcion.nombre"
        @mousedown="seleccionar(opcion)"
        :class="cerebroDatos.lugaresSeleccionados.includes(opcion) ? 'esconder' : ''"
        >{{ opcion.nombre }}</span
      >
    </div>
  </div>
</template>

<style>
#contenedorBuscador {
  width: 60%;
}

#buscador {
  padding: 10px;
  width: 100%;
  height: 39px;
  font-family: var(--fuenteParrafo);
  border: 1.5px solid var(--negro);
  color: var(--negro);
}

#sugerencias {
  position: absolute;
  height: 0;
  width: 400px;
  overflow: hidden;
  background-color: #fffee6fc;

  font-size: 0.85em;
  line-height: 1.6;
  border: none;
  transition: all 0.15s ease-in;
  padding: 0;
  z-index: 99;

  &.visible {
    height: 42vh;
    padding: 0.3em 0.5em;
    border: 2px solid;
    overflow: auto;
  }

  .opcion {
    display: block;
    cursor: pointer;

    &.esconder {
      display: none;
    }

    &:hover {
      background-color: rgba(255, 241, 163, 0.5);
      color: var(--negro);
    }
  }
}
</style>
