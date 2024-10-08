import type { PuntoSimple } from '@/tipos';

function anguloEntrePuntos(a: PuntoSimple, b: PuntoSimple) {
  return Math.atan2(b[1] - a[1], b[0] - a[0]);
}

function radianesAGrados(anguloEnRadianes: number) {
  return anguloEnRadianes * (180 / Math.PI);
}

function distancia(a: PuntoSimple, b: PuntoSimple) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export const convertirEscala = (
  valor: number,
  escalaBaseMin: number,
  escalaBaseMax: number,
  escalaDestinoMin: number,
  escalaDestinoMax: number
): number => {
  return (
    ((valor - escalaBaseMin) * (escalaDestinoMax - escalaDestinoMin)) / (escalaBaseMax - escalaBaseMin) +
    escalaDestinoMin
  );
};

export default class Particula {
  x: number;
  y: number;
  piso: number;
  velocidad: number;
  limiteX: number;
  limiteY: number;
  origenX: number;
  origenY: number;
  rebota: boolean;
  datos: PuntoSimple[];
  i = 0;
  angulo: number;

  constructor(
    x = 0,
    y = 0,
    velocidad = 1,
    origen: PuntoSimple,
    limites: PuntoSimple,
    datos: PuntoSimple[],
    rebota = false
  ) {
    this.x = x;
    this.y = y;
    this.piso = y;
    this.origenX = origen[0];
    this.origenY = origen[0];
    this.velocidad = velocidad;
    this.limiteX = limites[0];
    this.limiteY = limites[1];
    this.rebota = rebota;
    this.datos = datos;
    this.angulo = 0;
  }

  mover() {
    if (this.x >= this.datos[this.i][0]) {
      this.i = (this.i + 1) % this.datos.length;

      if (this.i > 0) {
        const puntoA = this.datos[this.i - 1];
        const puntoB = this.datos[this.i];
        this.angulo = anguloEntrePuntos(puntoA, puntoB);
      } else {
        this.angulo = 0;
        this.y = 0;
      }
    }

    if (this.x > this.limiteX) {
      const rebote = Math.random() > 0.01 ? this.x - Math.random() * 10 : this.origenX;
      this.x = this.rebota ? rebote : this.origenX;
    } else {
    }

    const velocidadMin = 0.0001;
    const velocidadMax = 1;
    if (this.angulo !== 0) {
      let velocidad = 0;
      if (this.angulo < 0) {
        velocidad = convertirEscala(this.angulo, -Math.PI, 0, velocidadMin, velocidadMax);
      } else {
        velocidad = convertirEscala(this.angulo, 0, Math.PI, velocidadMax, velocidadMin);
      }

      this.x += Math.cos(this.angulo) * velocidad;
      this.y += Math.sin(this.angulo) * velocidad;
    } else {
      this.x += this.velocidad;
      this.y = this.piso;
    }
  }

  actualizarPosiciones(x: number, y: number, origen: PuntoSimple, limites: PuntoSimple) {
    this.x = x;
    this.y = y;
    this.origenX = origen[0];
    this.origenY = origen[0];
    this.limiteX = limites[0];
    this.limiteY = limites[1];
  }
}
