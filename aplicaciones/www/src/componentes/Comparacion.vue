<script setup lang="ts">
import { colorMax, colorMedio, colorMin } from '@/cerebros/constantes';
import { usarCerebroDatos } from '@/cerebros/datos';
import { escalaColores } from '@/utilidades/ayudas';
import type { DatosInclusion } from 'tipos/compartidos';
import { computed } from 'vue';

const cerebroDatos = usarCerebroDatos();
const espacioY = 30;
const coloresAltos = escalaColores(20, 50, colorMax, colorMedio, 0.4);
const coloresBajos = escalaColores(50, 100, colorMedio, colorMin, 0.4);

function color(indice: number) {
  if (indice >= 50) return coloresBajos(indice);
  return coloresAltos(indice);
}

// Lista de lugares
const lugares = computed(() => {
  const seleccionados = cerebroDatos.lugaresSeleccionados;
  const datos = cerebroDatos.datosA;
  const res: DatosInclusion[] = [];
  seleccionados.forEach((lugarSeleccionado) => {
    const datosCompletosLugar = datos.find((lugar) => lugar.id === lugarSeleccionado.id);
    if (datosCompletosLugar) res.push(datosCompletosLugar);
  });

  return res.sort((a, b) => b.valorIndice - a.valorIndice);
});

// Hacer otra lista de lugares pero sin contar el primer elemento para generar las barras comparativas.
const lugaresDif = computed(() => lugares.value.filter((_, i) => i > 0));
</script>

<template>
  <section id="contenedorComp" class="centrado">
    <h2>Comparación</h2>

    <div id="seleccionadosComp" ref="seleccionadosComp">
      <p id="leyendaY">Índice de inclusión</p>

      <span
        v-for="(lugar, i) in lugares"
        :key="`lugar-nombre${i}`"
        class="nombreLugar"
        :style="`top:${espacioY * i}px`"
      >
        {{ lugar.nombre }}</span
      >

      <span
        v-for="(lugar, i) in lugares"
        :key="`lugar-barra${i}`"
        class="barra"
        :style="`top:${espacioY * i}px;width:${lugar.valorIndice}%;background-color:${color(lugar.valorIndice)}`"
      ></span>

      <div
        v-for="(lugar, i) in lugaresDif"
        class="diferencias"
        :key="`diferencias${i}`"
        :style="`top:${espacioY * (i + 1) - 15}px;left:${lugar.valorIndice}%;width: ${lugares[i].valorIndice - lugar.valorIndice}%`"
      >
        <span class="diferencia-limite"></span>
        <span class="diferencia" :style="`top:${espacioY * i - 10}px;`"></span>
        <span :key="`diferenciaLimiteB${i}`" class="diferencia-limite"></span>
        <span :key="`diferencia-etiqueta${i}`" class="diferencia-etiqueta"
          >{{ `${Math.abs(lugares[i].valorIndice - lugar.valorIndice).toFixed(2)}` }}
        </span>
      </div>

      <span
        v-for="(lugar, i) in lugares"
        :key="`lugar-barra${i}`"
        class="etiqueta"
        :style="`top:${espacioY * i}px; left: ${lugar.valorIndice}%`"
        >{{ lugar.valorIndice.toFixed(2) }}</span
      >
    </div>
  </section>
</template>

<style lang="scss" scoped>
#contenedorComp {
  padding-top: 2em;
  height: 30%;
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
    display: flex;
    align-items: center;
  }

  .diferencia {
    height: 1px;
    border-top: 1px dashed;
    display: block;
    width: 100%;
  }

  .diferencia-limite {
    height: 0.9em;
    border-left: 1px dashed;
  }

  .diferencia-etiqueta {
    display: block;
    font-size: 0.7em;
    position: absolute;
    left: 100%;
    margin-left: 3px;
  }
}
</style>
