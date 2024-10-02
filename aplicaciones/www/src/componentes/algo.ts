// const porcentajesC = [100, 98, 93, 62];
const contador = ref(0);
const dims = { ancho: 0, alto: 0, izq: 0, der: 0 };
let ctx: CanvasRenderingContext2D | null = null;
const actualizarContador = (evento: any) => {
  // console.log(evento);
};
const grafica = ref();
const refLienzo: Ref<HTMLCanvasElement | null> = ref(null);
let particulas: Particula[] = [];

// console.log(porcentajesC, porcentajesV);

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
      // console.log('quedaron', pasan, particulas.length);
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
