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
        :key="`diferencia${i}`"
        class="diferencia"
        :style="`top:${i > 0 ? 33 * i - 10 : 0}px; left: ${cerebroDatos.lugaresSeleccionados.length > 1 && i > 0 ? (cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice < cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice ? cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice : cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice) : 0}%; width:  ${
          cerebroDatos.lugaresSeleccionados.length > 1 && i > 0
            ? (cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice >
              cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice
                ? cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice -
                  cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice
                : cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice -
                  cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice
              ).toFixed(2)
            : 0
        }%`"
      ></span>
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`diferencia-etiqueta${i}`"
        class="diferencia-etiqueta"
        :style="`top:${i > 0 ? 33 * i - 10 : 0}px; left: ${cerebroDatos.lugaresSeleccionados.length > 1 && i > 0 ? cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice : 0}%;`"
        >{{
          cerebroDatos.lugaresSeleccionados.length > 1 && i > 0
            ? `dif: ${Math.abs(
                cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice -
                  cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice
              ).toFixed(2)}`
            : ''
        }}
      </span>
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

  .diferencia {
    height: 1px;
    background-color: var(--negro);
    display: block;
    position: absolute;
  }

  .diferencia-etiqueta {
    display: block;
    position: absolute;
    font-size: 0.7em;
    color: grey;
  }

  .etiqueta {
    position: absolute;
    margin-left: 0.2em;
    font-size: 0.8em;
  }
}
</style>
