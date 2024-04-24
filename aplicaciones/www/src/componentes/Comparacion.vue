<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
</script>

<template>
  <section id="contenedorComp" class="seccionCentro">
    <h2>Comparación</h2>
    <div id="seleccionadosComp" ref="seleccionadosComp">
      <p id="leyendaY">Índice de inclusión</p>
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`lugar-nombre${i}`"
        class="nombreLugar"
        :style="`top:${33 * i}px`"
      >
        {{ lugar.nombre }}</span
      >
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`lugar-barra${i}`"
        class="barra"
        :style="`top:${33 * i}px; width:${cerebroDatos.datos[lugar.id].valorIndice}%`"
      ></span>
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`lugar-barra${i}`"
        class="etiqueta"
        :style="`top:${33 * i}px; left: ${cerebroDatos.datos[lugar.id].valorIndice}%`"
        >{{ cerebroDatos.datos[lugar.id].valorIndice.toFixed(2) }}</span
      >
    </div>
  </section>
</template>

<style lang="scss" scoped>
#contenedorComp {
  height: 28vh;
  background-color: var(--naranja);
  overflow-y: auto; /* Add the ability to scroll */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .scroll-container::-webkit-scrollbar {
    display: none;
  }
}
#seleccionadosComp {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  margin: 0em 0em 1em 5em;
  position: relative;
  height: 125px;

  #leyendaY {
    position: absolute;
    right: 0;
    top: -2.5em;
    font-size: 0.7em;
  }

  .nombreLugar {
    position: absolute;
    left: -7em;
    width: 78px;
    font-size: 0.8em;
    line-height: 0.8em;
    text-align: right;
  }

  .barra {
    display: block;
    height: 1em;
    width: 100px;
    background-color: var(--azul);
    position: absolute;
  }

  .etiqueta {
    position: absolute;
    margin-left: 0.2em;
    font-size: 0.8em;
  }
}
</style>
