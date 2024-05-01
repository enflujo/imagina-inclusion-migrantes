<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();

function buscarIndice(id: number) {
  const municipio = cerebroDatos.datos.find((lugar) => lugar.id === id);

  if (municipio) {
    return municipio.valorIndice.toFixed(2);
  }
}
</script>

<template>
  <section id="contenedorComp" class="centrado">
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
        :style="`top:${33 * i}px; width:${buscarIndice(lugar.id)}%`"
      ></span>
      <div
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        class="diferencias"
        :key="`diferencias${i}`"
        :style="`display:${i > 0 ? 'visible' : 'none'};top:${i > 0 ? 33 * i - 15 : 0}px; left: ${cerebroDatos.lugaresSeleccionados.length > 1 && i > 0 ? (cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice < cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice ? cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice : cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i].id].valorIndice) : 0}%;`"
      >
        <span class="diferencia-limite"> </span>
        <span
          class="diferencia"
          :style="`top:${i > 0 ? 33 * i - 10 : 0}px; width:  ${
            cerebroDatos.lugaresSeleccionados.length > 1 && i > 0
              ? (buscarIndice(lugar.id) > cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice
                  ? buscarIndice(lugar.id) - cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice
                  : cerebroDatos.datos[cerebroDatos.lugaresSeleccionados[i - 1].id].valorIndice - buscarIndice(lugar.id)
                ).toFixed(2)
              : 0
          }%`"
        ></span>
        <span :key="`diferencia-etiqueta${i}`" class="diferencia-limite"> </span>
        <span :key="`diferencia-etiqueta${i}`" class="diferencia-etiqueta"
          >{{
            cerebroDatos.lugaresSeleccionados.length >= 1 && i > 0 && cerebroDatos.lugaresSeleccionados[i - 1]
              ? `${Math.abs(
                  buscarIndice(lugar.id) - buscarIndice(cerebroDatos.lugaresSeleccionados[i - 1]['id'])
                ).toFixed(2)}`
              : ''
          }}
        </span>
      </div>
      <span
        v-for="(lugar, i) in cerebroDatos.lugaresSeleccionados"
        :key="`barra-etiqueta${i}`"
        class="etiqueta"
        :style="`top:${33 * i}px; left: ${buscarIndice(lugar.id)}%`"
        >{{ buscarIndice(lugar.id) }}</span
      >
    </div>
  </section>
</template>

<style lang="scss" scoped>
#contenedorComp {
  height: 28vh;
  background-color: var(--naranja);
  padding-top: 3em;
}

#seleccionadosComp {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  margin: 0em 0em 1em 4em;
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
    line-height: 0.9em;
    text-align: right;
    margin-left: 0.7em;
    padding-right: 0.5em;
  }

  .barra {
    display: block;
    height: 1em;
    width: 100px;
    background-color: var(--rosado);
    position: absolute;
  }
  .etiqueta {
    position: absolute;
    margin-left: 0.2em;
    font-size: 0.8em;
    color: var(--azul);
  }

  // Diferencias entre dos barras
  .diferencias {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .diferencia {
    height: 1px;
    border-top: 1px var(--naranja2) dashed;
    display: block;
  }

  .diferencia-limite {
    height: 0.3em;
    border-left: 1px var(--naranja2) dashed;
  }

  .diferencia-etiqueta {
    display: block;
    font-size: 0.7em;
    color: var(--naranja2);
    margin-inline-start: 0.2em;
  }
}
</style>
