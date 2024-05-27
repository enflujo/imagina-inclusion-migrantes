<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const llaves = ['regularizadas', 'afiliadas', 'atendidas', 'embarazadasAtendidas', 'cuatroControles'];
const totalV = 1468809;

const totalEmbarazadasV = 1350000;
const datosControlesV = [1233696, 932344, 238296, 25625, 4818];
const porcentajesV = [83.99, 63.48, 17.65, 1.9, 0.36];
const nombres = ['Regularizadas', 'Afiliadas', 'Atendidas', 'Embarazadas Atendidas', 'Con 4 controles'];

const totalC = 26316000;
const totalEmbarazadasC = totalC * 0.22;
const datosControlesC = [
  totalEmbarazadasC,
  totalEmbarazadasC * 0.98,
  totalEmbarazadasC * 0.97,
  totalEmbarazadasC * 0.93,
  totalEmbarazadasC * 0.62,
];
const porcentajesC = [100, 98, 97, 93, 62];
const contador = ref(0);

const actualizarContador = (evento: any) => {
  console.log(evento);
};

onMounted(() => {
  window.addEventListener('scroll', actualizarContador);
});

onUnmounted(() => {
  window.removeEventListener('scroll', actualizarContador);
});

function numeroConteo(valor: number) {
  return new Intl.NumberFormat('en-US').format(valor);
}
</script>

<template>
  <nav id="navegacionInterna">
    <ul>
      <li><a class="enlace">Antes del estatuto temporal de permanencia</a></li>
    </ul>
  </nav>

  <h1 class="pregunta">¿Cuantas mujeres se hacen los 4 controles prenatales durante su embarazo?</h1>

  <div class="columnas">
    <section id="areaColombianas" class="columna">
      <h2>Colombianas</h2>

      <div class="total escalon">
        <p>
          En el año 2024, hay un total de <span class="conteo">{{ numeroConteo(totalEmbarazadasC) }}</span> mujeres
          embarazadas en Colombia.
        </p>
      </div>

      <div class="escalon subEscalon" v-for="(escalon, i) in porcentajesC">
        <span class="cubierto" :style="`width:${escalon}%`">
          <span class="contenido">{{ nombres[i] }}: {{ escalon }}% ({{ numeroConteo(datosControlesC[i]) }})</span>
        </span>

        <span class="vacio" :style="`width:${100 - escalon}%`"></span>
      </div>
    </section>

    <section id="areaVenezolanas" class="columna">
      <h2>Venezolanas</h2>

      <div class="total escalon">
        <p>
          En el año 2024, hay un total de <span class="conteo">{{ numeroConteo(totalEmbarazadasV) }}</span> mujeres
          venezolanas embarazadas en Colombia.
        </p>
      </div>

      <div class="escalon subEscalon" v-for="(escalon, i) in porcentajesV">
        <span class="cubierto" :style="`width:${escalon}%`">
          <span class="contenido">{{ nombres[i] }}: {{ escalon }}% ({{ numeroConteo(datosControlesV[i]) }})</span>
        </span>

        <span class="vacio" :style="`width:${100 - escalon}%`"></span>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
$colorPositivo: rgb(13, 141, 130);
$colorPositivo2: rgb(13, 141, 130);
$colorNegativo: rgb(210, 87, 87);

.columnas {
  display: flex;
  justify-content: space-around;

  .columna {
    width: 48%;

    h2 {
      text-align: center;
    }
  }
}

.enlace {
  cursor: pointer;
  padding: 0.3em;
  background-color: white;
}

.pregunta {
  font-size: 3em;
  text-align: center;
  width: 50vw;
  margin: 2em auto;
}

.escalon {
  height: 200px;
  font-size: 1.8em;
  color: rgb(246, 239, 217);

  p {
    text-align: center;
    margin: 0;
  }
}

.contenido {
  position: absolute;
  top: 50%;
  left: 50%;
  // transform: translateX(-50%);
}

.cubierto {
  background-color: $colorPositivo;
  height: 100%;
  display: inline-block;
  position: relative;
}

.vacio {
  background-color: $colorNegativo;
  height: 100%;
  display: inline-block;
}

.conteo {
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 2.5em;
}

.total {
  width: 100%;
  background-color: $colorPositivo;
  color: rgb(246, 239, 217);
  padding: 1em;
}
</style>
