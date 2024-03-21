<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import type { DatosInclusion } from 'tipos/compartidos';
import { onMounted, ref, type Ref } from 'vue';

const cerebroDatos = usarCerebroDatos();
const datos: Ref<DatosInclusion[]> = ref([]);

onMounted(async () => {
  if (!cerebroDatos.cargados) {
    await cerebroDatos.cargarDatos();
  }

  datos.value = cerebroDatos.datos;

  inicio();
});

function inicio() {}

function ordenarLista(criterioOrden: 'ascendente' | 'descendente' | 'alfabetico') {
  console.log(criterioOrden);
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

// function filtrarLista(
//   min: number,
//   max: number,
//   datos: { nombre: string; dep: string; valorRank: number; encuestado: boolean }[]
// ) {
//   if (!contenedorLista) return;

//   datosCargados = datos.filter((dato) => dato.valorRank >= min && dato.valorRank <= max);

//   if (!contenedorLista) return;
//   contenedorLista.innerHTML = '';
//   inicio(datosCargados);
// }

// export default async function lista() {
//   let datosOriginales: { nombre: string; dep: string; valorRank: number; encuestado: boolean }[] = [];
//   let datosCargados: { nombre: string; dep: string; valorRank: number; encuestado: boolean }[] = [];
//   const contenedorLista = document.getElementById('contenedorLista');
//   const botonAlfabetico = document.getElementById('alfabetico');
//   const botonAscendente = document.getElementById('ascendente');
//   const botonDescendente = document.getElementById('descendente');

//   let mayorDesde: boolean;
//   let mayorHasta: boolean;

//   ////////////deslizador
//   let desde: number;
//   let hasta: number;

//   function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
//     const [from, to] = getParsed(fromInput, toInput);
//     fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
//     if (from > to) {
//       fromSlider.value = to;
//       fromInput.value = to;
//     } else {
//       fromSlider.value = from;
//     }
//   }

//   function controlToInput(toSlider, fromInput, toInput, controlSlider) {
//     const [from, to] = getParsed(fromInput, toInput);
//     fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
//     setToggleAccessible(toInput);
//     if (from <= to) {
//       toSlider.value = to;
//       toInput.value = to;
//     } else {
//       toInput.value = from;
//     }
//   }

//   function controlFromSlider(fromSlider, toSlider, fromInput) {
//     const [from, to] = getParsed(fromSlider, toSlider);
//     //  console.log(from, desde);
//     if (from > desde) {
//       mayorDesde = true;
//     } else {
//       mayorDesde = false;
//     }
//     fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
//     if (from > to) {
//       fromSlider.value = to;
//       fromInput.value = to;
//     } else {
//       fromInput.value = from;
//     }
//   }

//   function controlToSlider(fromSlider, toSlider, toInput) {
//     const [from, to] = getParsed(fromSlider, toSlider);
//     fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
//     setToggleAccessible(toSlider);
//     if (from <= to) {
//       toSlider.value = to;
//       toInput.value = to;
//     } else {
//       toInput.value = from;
//       toSlider.value = from;
//     }
//   }

//   let anterior: number;
//   function getParsed(currentFrom, currentTo) {
//     const from = parseInt(currentFrom.value, 10);
//     const to = parseInt(currentTo.value, 10);

//     filtrarLista(from, to, datosCargados);
//     return [from, to];
//   }

//   function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
//     const rangeDistance = to.max - to.min;
//     const fromPosition = from.value - to.min;
//     const toPosition = to.value - to.min;
//     controlSlider.style.background = `linear-gradient(
//     to right,
//     ${sliderColor} 0%,
//     ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
//     ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
//     ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
//     ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
//     ${sliderColor} 100%)`;
//   }

//   function setToggleAccessible(currentTarget) {
//     const toSlider = document.querySelector('#toSlider');
//     if (Number(currentTarget.value) <= 0) {
//       toSlider.style.zIndex = 2;
//     } else {
//       toSlider.style.zIndex = 0;
//     }
//   }

//   const fromSlider = document.querySelector('#fromSlider');
//   const toSlider = document.querySelector('#toSlider');
//   const fromInput = document.querySelector('#fromInput');
//   const toInput = document.querySelector('#toInput');
//   fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
//   setToggleAccessible(toSlider);

//   fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
//   toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
//   fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
//   toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

//   /*   fromSlider.addEventListener('change', (event) => {
//     desde = event.target.value;
//     console.log(desde, anterior);
//   }); */
// }
</script>

<template>
  <section id="contenedorIndice">
    <h2>Índice de inclusión</h2>

    <section id="moduloLista">
      <div id="ordenarPor">
        <p>Ordenar por:</p>
        <button id="alfabetico" @click="ordenarLista('alfabetico')">Alfabético</button>
        <button id="ascendente" @click="ordenarLista('ascendente')">Ranking ascendente</button>
        <button id="descendente" @click="ordenarLista('descendente')">Ranking descendente</button>
      </div>
      <div id="contenedorLista">
        <ul>
          <li
            v-for="(elemento, i) in datos"
            :key="`${elemento.nombre}-${i}`"
            class="lugar"
            :class="`${elemento.encuestado ? ' encuestado' : ''}`"
          >
            <span class="municipio">{{ elemento.nombre }}</span>
            <span class="departamento">, {{ elemento.dep }}</span>
            <span class="valor">: {{ elemento.valorRank }}</span>
          </li>
        </ul>
      </div>
    </section>
  </section>
</template>
