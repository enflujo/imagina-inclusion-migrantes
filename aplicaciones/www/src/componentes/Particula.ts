export default class Particula {
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
