<script setup lang="ts">
import { escalaColores } from '@enflujo/alquimia';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

let reloj = 0;
const llaves = ['regularizadas', 'afiliadas', 'atendidas', 'cuatroControles'];
const totalV = 1468809;
// $colorPositivo: rgb(13, 141, 130);
// $colorPositivo2: rgb(13, 141, 130);
// $colorNegativo: rgb(210, 87, 87);
/**
 * $anchoEscalon: calc(90vw / 5);
  $alto2: calc($altoTotal * 0.8265);
  $diferencia1: calc($altoTotal - $alto2);
  $alto3: calc($altoTotal * 0.5207);
  $diferencia2: calc($alto2 - $alto3);
  $alto4: calc($altoTotal * 0.3789);
  $diferencia3: calc($alto3 - $alto4);
  $alto5: calc($altoTotal * 0.3426);
  $diferencia4: calc($alto4 - $alto5);
 */

const color = escalaColores(0, 100, '#963c3c', '#5a997e');
console.log(color(82.65));
const totalEmbarazadasV = 76599;
const datosControlesV = [63306, 39883, 28246, 26243];
const diferenciasV = datosControlesV.map((valor) => totalEmbarazadasV - valor);
const diferenciasPorcentajeV = diferenciasV.map((valor) => +((valor / totalEmbarazadasV) * 100).toFixed(2));
const saltosDiferencias: number[] = [];
const porcentajesV = datosControlesV.map((valor) => +((valor / totalEmbarazadasV) * 100).toFixed(2));
const anchos = porcentajesV.map((valor, i) => [100 * (valor / 100), 100 * (diferenciasPorcentajeV[i] / 100)]);

anchos.forEach((valores, i) => {
  const anterior = i === 0 ? 0 : anchos[i - 1][1];
  saltosDiferencias.push(+(valores[1] - anterior).toFixed(2));
});

const totalC = 26316000;
const totalEmbarazadasC = totalC * 0.22;
const datosControlesC = [
  totalEmbarazadasC,
  totalEmbarazadasC * 0.98,
  totalEmbarazadasC * 0.93,
  totalEmbarazadasC * 0.62,
];
const porcentajesC = [100, 98, 93, 62];
const contador = ref(0);
const dims = { ancho: 0, alto: 0, izq: 0, der: 0 };
let ctx: CanvasRenderingContext2D | null = null;
const actualizarContador = (evento: any) => {
  // console.log(evento);
};
const grafica = ref();
const refLienzo: Ref<HTMLCanvasElement | null> = ref(null);
let particulas: Particula[] = [];

class Particula {
  x: number;
  y: number;
  velocidad: number;
  limiteX: number;
  limiteY: number;
  origenX: number;
  origenY: number;
  rebota: boolean;

  constructor(
    x = 0,
    y = 0,
    velocidad = 1,
    origen: [x: number, y: number],
    limites: [x: number, y: number],
    rebota = false
  ) {
    this.origenX = origen[0];
    this.origenY = origen[0];
    this.x = x;
    this.y = y;
    this.velocidad = velocidad;
    this.limiteX = limites[0];
    this.limiteY = limites[1];
    this.rebota = rebota;
  }

  mover() {
    this.x += this.velocidad;
    // this.x = this.limiteX > this.x ? this.x : this.origenX;

    if (this.x > this.limiteX) {
      const rebote = Math.random() > 0.01 ? this.x - Math.random() * 10 : this.origenX;
      this.x = this.rebota ? rebote : this.origenX;
    } else {
    }
  }
}

onMounted(() => {
  if (refLienzo.value) {
    const lienzo = refLienzo.value;
    if (!ctx) ctx = lienzo.getContext('2d') as CanvasRenderingContext2D;
    escalar();
    animacion(ctx, lienzo);
  }

  window.addEventListener('resize', escalar);
  window.addEventListener('scroll', actualizarContador);
});

function crearParticulas() {
  const numeroParticulas = 4000;
  particulas = [];

  const altoEscalon = 400;
  const techoEscalones = dims.alto - altoEscalon;
  const anchoEscalon = dims.ancho / 5;
  let xMax = anchoEscalon;
  let y1 = 0;
  let pasan = numeroParticulas;
  anchos.forEach(([pEscalera, pDiferencia], i) => {
    if (i > 5) return;

    const quedan = pasan * (pDiferencia / 100);
    const y2 = altoEscalon * (pDiferencia / 100) - y1;
    const velocidad = 0.4 + Math.random() * 0.3;

    const xMax = anchoEscalon * (i + 1);

    for (let i = 0; i < quedan; i++) {
      const x = Math.random() * xMax;
      const y = y1 + techoEscalones + Math.random() * y2;
      particulas.push(new Particula(x, y, velocidad, [0, 0], [xMax, 0], true));
    }

    y1 += y2;

    if (i < porcentajesV.length - 1) {
      pasan -= quedan;
    } else {
      console.log('quedaron', pasan, particulas.length);
    }

    // if (i > -1) {
    //   const anchoDif = altoEscalon * (diferenciasPorcentajeV[i] / 100);
    //   const anchoEscalera = altoEscalon * (porcentaje / 100);
    //   console.log(anchoDif, anchoEscalera, anchoDif + anchoEscalera);
    //   xMax += anchoDif + anchoEscalera;
    // }
  });

  for (let i = 0; i < pasan * 4; i++) {
    const x = Math.random() * (anchoEscalon * 5);
    const y2 = altoEscalon * (100 / 100) - y1;
    const y = y1 + techoEscalones + Math.random() * y2;
    particulas.push(new Particula(x, y, 0.4 + Math.random() * 0.3, [0, 0], [anchoEscalon * 5, 0], false));
  }

  // const corte1 = porcentajesV[0];
  // const pasanCorte1 = numeroParticulas * (corte1 / 100);
  // const quedanCorte1 = numeroParticulas - pasanCorte1;

  // let y2 = altoEscalon * (diferenciasPorcentajeV[0] / 100);
  // let velocidad = Math.random() * 0.1;

  // for (let i = 0; i < quedanCorte1; i++) {
  //   const x = Math.random() * xMax;
  //   const y = y1 + techoEscalones + Math.random() * y2;
  //   particulas.push(new Particula(x, y, velocidad, [0, 0], [xMax, 0]));
  // }

  // xMax = anchoEscalon * 2;
  // y1 = y2;
  // y2 = altoEscalon * (diferenciasPorcentajeV[1] / 100) - y2;
  // velocidad = Math.random() * 1.3;

  // const corte2 = porcentajesV[1];
  // const pasanCorte2 = numeroParticulas * (corte2 / 100);
  // const quedanCorte2 = numeroParticulas - pasanCorte2;

  // for (let i = 0; i < quedanCorte2; i++) {
  //   const x = Math.random() * xMax;
  //   const y = y1 + techoEscalones + Math.random() * y2;
  //   particulas.push(new Particula(x, y, velocidad, [0, 0], [xMax, 0]));
  // }

  // for (let i = 0; i < numeroParticulas; i++) {
  //   const x = dims.izq;
  //   const y = 100 + Math.random() * 400;
  //   particulas.push(new Particula(x, y, 1.2 + Math.random(), [dims.der, 400]));
  // }
}

function animacion(ctx: CanvasRenderingContext2D, lienzo: HTMLCanvasElement) {
  function ciclo() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);

    particulas.forEach((particula) => {
      particula.mover();
      ctx.fillRect(particula.x, particula.y, 1.5, 1.5);
    });
    reloj = requestAnimationFrame(ciclo);
  }
  reloj = requestAnimationFrame(ciclo);
}

onUnmounted(() => {
  cancelAnimationFrame(reloj);
  window.removeEventListener('resize', escalar);
  window.removeEventListener('scroll', actualizarContador);
});

function numeroConteo(valor: number) {
  return new Intl.NumberFormat('en-US').format(valor);
}

function escalar() {
  if (refLienzo.value && grafica.value) {
    dims.ancho = refLienzo.value.width = (grafica.value.clientWidth * 0.9) | 0;
    dims.alto = refLienzo.value.height = grafica.value.clientHeight;
    const margen = dims.ancho / 2;
    dims.izq = margen;
    dims.der = dims.ancho - margen;

    if (ctx) {
      ctx.fillStyle = '#498E75';
    }

    crearParticulas();
  }
}
</script>

<template>
  <!-- <nav id="navegacionInterna">
    <ul>
      <li><a class="enlace">Antes del estatuto temporal de permanencia</a></li>
    </ul>
  </nav> -->
  <header>
    <h1>Controles prenatales durante el embarazo</h1>

    <p class="pregunta">
      Son <span class="bajo resaltar">pocas</span> las mujeres venezolanas que se realizan los cuatro controles
      prenatales durante su embarazo, apenas un tercio: <span class="bajo resaltar">{{ porcentajesV[3] }}%</span>
    </p>

    <!-- <p>
      <span class="alto resaltar">La mayoría</span> de las que sí utilizan el sistema de salud, se realizan los 4
      controles prenatales: <span class="resaltar">{{ numeroConteo(datosControlesV[3]) }}</span> de
      <span class="resaltar">{{ numeroConteo(datosControlesV[2]) }}</span> o el
      <span class="resaltar alto">{{ ((datosControlesV[3] / datosControlesV[2]) * 100).toFixed(2) }}%</span> de las
      mujeres que son atendidas al menos en una oportunidad dentro del sistema de salud.
    </p> -->

    <p>
      <span class="resaltar bajo">Uno de los mayores problema</span> es la afiliación, tan solo la mitad de las mujeres
      embarazadas está afiliada al sistema de salud: <span class="resaltar bajo">{{ porcentajesV[1] }}%</span>
    </p>

    <p>
      <span class="resaltar bajo">Se debe mejorar</span> el uso del sistema para así mejorar el número de mujeres
      embarazadas que se realicen los 4 controles: actualmente, sólo el
      <span class="resaltar bajo">{{ porcentajesV[2] }}%</span>
    </p>
  </header>

  <div id="grafica" ref="grafica">
    <span class="escalon escalon1" :style="`color:${color(100)}`"
      >100% <span class="mensaje">Mujeres Venezolanas embarazadas</span></span
    >
    <span class="diferencia diferencia1">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[0] }}%</span>
    </span>
    <span
      class="escalon escalon2"
      :style="`font-size:${3 * (porcentajesV[0] / 100)}vw; color:${color(porcentajesV[0])}`"
    >
      {{ porcentajesV[0] }}%
      <span class="mensaje">Regularizadas</span>
    </span>
    <span class="diferencia diferencia2">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[1] }}%</span>
    </span>
    <span
      class="escalon escalon3"
      :style="`font-size:${3 * (porcentajesV[1] / 100)}vw; color:${color(porcentajesV[1])}`"
      >{{ porcentajesV[1] }}%
      <span class="mensaje">Afiliadas al sistema de salud</span>
    </span>
    <span class="diferencia diferencia3">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[2] }}%</span>
    </span>
    <span
      class="escalon escalon4"
      :style="`font-size:${3 * (porcentajesV[2] / 100)}vw; color:${color(porcentajesV[2])}`"
      >{{ porcentajesV[2] }}%
      <span class="mensaje">Atendidas dentro del sistema de salud</span>
    </span>
    <span class="diferencia diferencia4">
      <span class="porcentaje"><span class="abajo">&#11183;</span>{{ saltosDiferencias[3] }}%</span>
    </span>
    <span
      class="escalon escalon5"
      :style="`font-size:${3 * (porcentajesV[3] / 100)}vw; color:${color(porcentajesV[3])}`"
      >{{ porcentajesV[3] }}%
      <span class="mensaje">Hicieron sus 4 controles prenatales</span>
    </span>

    <canvas id="lienzo" ref="refLienzo"></canvas>
  </div>

  <!-- <div class="columnas">
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
  </div> -->
</template>

<style lang="scss">
#aplicacion {
  padding-bottom: 10em;
}
</style>

<style lang="scss" scoped>
$colorPositivo: rgb(13, 141, 130);
$colorPositivo2: rgb(13, 141, 130);
$colorNegativo: rgb(210, 87, 87);
$altoTotal: 400px;
$anchoEscalon: calc(90vw / 5);
$alto2: calc($altoTotal * 0.8265);
$diferencia1: calc($altoTotal - $alto2);
$alto3: calc($altoTotal * 0.5207);
$diferencia2: calc($alto2 - $alto3);
$alto4: calc($altoTotal * 0.3789);
$diferencia3: calc($alto3 - $alto4);
$alto5: calc($altoTotal * 0.3426);
$diferencia4: calc($alto4 - $alto5);

.bajo {
  color: $colorNegativo;
}

.alto {
  color: $colorPositivo;
}

.resaltar {
  font-weight: bold;
}

#grafica {
  height: 500px;
  margin: 0 auto;
  background-color: rgba(245, 245, 245, 0.534);
  display: flex;
  position: relative;
  padding-left: 5%;

  #lienzo {
    position: absolute;
    left: 5%;
  }

  .escalon {
    font-size: 3vw;
    color: $colorPositivo;
    position: relative;

    &:nth-child(1) {
      border-left: 3px solid $colorPositivo;
    }

    &:nth-child(9) {
      border-right: 1px solid $colorPositivo;
    }

    border-top: 3px solid $colorPositivo;
    border-bottom: 3px solid $colorPositivo;

    .mensaje {
      font-size: 28px;
      position: absolute;
      left: 0;
      bottom: 0px;
      width: 90%;
      vertical-align: top;
    }
  }

  .diferencia {
    border-style: solid;
    border-color: transparent transparent $colorNegativo transparent;
    position: relative;

    .porcentaje {
      position: absolute;
      top: -20px;
      font-size: 1.3em;
      left: 10px;
    }

    .abajo {
      color: $colorNegativo;
    }
  }

  .diferencia1 {
    height: $diferencia1;
    margin-top: calc(500px - $altoTotal);
    border-width: 0 $diferencia1 $diferencia1 0;
  }

  .diferencia2 {
    height: $diferencia2;
    margin-top: calc(500px - $alto2);
    border-width: 0 $diferencia2 $diferencia2 0;
  }

  .diferencia3 {
    height: $diferencia3;
    margin-top: calc(500px - $alto3);
    border-width: 0 $diferencia3 $diferencia3 0;
  }

  .diferencia4 {
    height: $diferencia4;
    margin-top: calc(500px - $alto4);
    border-width: 0 $diferencia4 $diferencia4 0;
  }

  .escalon1 {
    height: $altoTotal;
    width: $anchoEscalon;
    margin-top: calc(500px - $altoTotal);
  }

  .escalon2 {
    height: $alto2;
    width: calc($anchoEscalon - $diferencia1);
    margin-top: calc(500px - $alto2);
  }

  .escalon3 {
    height: $alto3;
    width: calc($anchoEscalon - $diferencia2);
    margin-top: calc(500px - $alto3);
  }

  .escalon4 {
    height: $alto4;
    width: calc($anchoEscalon - $diferencia3);
    margin-top: calc(500px - $alto4);
  }

  .escalon5 {
    height: $alto5;
    width: calc($anchoEscalon - $diferencia4);
    margin-top: calc(500px - $alto5);
  }
}

// .columnas {
//   display: flex;
//   justify-content: space-around;

//   .columna {
//     width: 48%;

//     h2 {
//       text-align: center;
//     }
//   }
// }

// .enlace {
//   cursor: pointer;
//   padding: 0.3em;
//   background-color: white;
// }

header {
  width: 50vw;
  margin: 2em auto 0.2em;

  h1 {
    font-size: 3em;
    text-align: center;
  }

  p {
    font-size: 2em;
  }
}

// .escalon {
//   height: 200px;
//   font-size: 1.8em;
//   color: rgb(246, 239, 217);

//   p {
//     text-align: center;
//     margin: 0;
//   }
// }

// .contenido {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   // transform: translateX(-50%);
// }

// .cubierto {
//   background-color: $colorPositivo;
//   height: 100%;
//   display: inline-block;
//   position: relative;
// }

// .vacio {
//   background-color: $colorNegativo;
//   height: 100%;
//   display: inline-block;
// }

// .conteo {
//   font-weight: bold;
//   letter-spacing: 2px;
//   font-size: 2.5em;
// }

// .total {
//   width: 100%;
//   background-color: $colorPositivo;
//   color: rgb(246, 239, 217);
//   padding: 1em;
// }
//
</style>
