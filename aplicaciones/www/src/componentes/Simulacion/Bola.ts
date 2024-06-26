/*
	Constructor de la bola
*/
export default class Bola {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  r: number;
  m: number;
  p: { x: number; y: number };
  v: { x: number; y: number };
  activo: boolean;
  color: string;
  esMuro: boolean;
  largoMuro: number;
  //rotacion: number;
  parabola: number;
  corono: boolean;

  constructor(
    posX: number,
    posY: number,
    velX: number,
    velY: number,
    r: number,
    m?: number,
    color?: string,
    esMuro = false
  ) {
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    this.r = r;
    this.p = { x: posX, y: posY };
    this.v = { x: velX, y: velY };
    this.activo = !esMuro;
    this.m = m !== undefined ? m : Math.ceil(Math.PI * r * r);
    this.color = color || '#c22f20';
    this.esMuro = esMuro;
    this.largoMuro = (Math.random() * this.r) / 2;
    this.parabola = 1.1;
    //this.altoMuro = (Math.random() * this.r) / 2;
    // this.rotacion = Math.random() * (Math.PI * 2);
    // if (esMuro) {
    //   if (this.posX > 250) {
    //     this.posX = 250;
    //   }
    // }

    if (esMuro) {
      this.color = '#c22f20';
    }

    this.corono = false;
  }

  // mover/dibujar básico
  mover(dt: number, anchoLienzo: number, altoLienzo: number) {
    if (this.esMuro) return;

    // Por hacer: definir umbral a partir del cual las bolas cambian de color
    if (this.activo && this.p.x > anchoLienzo * 0.7 && this.p.y < altoLienzo) {
      this.activo = false;
    } else {
    }

    if (this.activo) {
      this.p.x = this.p.x + this.v.x * dt;
      this.p.y = this.p.y + this.v.y * dt;
    } else {
      if (this.v.x > 0) {
        let nueva = Math.pow(this.parabola, 2);
        this.v.x = this.p.x < 575 ? this.v.x - nueva : 0;
        this.v.y = 0;
        this.p.x = this.p.x + this.v.x * dt;
        this.p.y = this.p.y + this.v.y * dt;

        this.parabola += 0.01;
      }
      this.color = '#00a753'; // Color de las bolas cuando pasan al otro lado
    }
  }

  dibujar(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    if (this.esMuro && this.largoMuro) {
      ctx.save();
      ctx.translate(this.posX, this.posY);
      // ctx.rotate(this.rotacion);
      //ctx.rect(0, 0, this.r, this.r * this.largoMuro);
      ctx.rect(0, 0, this.r, this.r);
      ctx.restore();
    } else {
      ctx.arc(this.p.x, this.p.y, this.r, 0, 2 * Math.PI);
    }

    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Comparar igualdad
  equals(bola: Bola) {
    return (
      this.p.x === bola.p.x &&
      this.p.y === bola.p.y &&
      this.v.x === bola.v.x &&
      this.v.y === bola.v.y &&
      this.r === bola.r
    );
  }

  // Predicción de la colisión
  timeToHit(bola: Bola) {
    if (this.equals(bola)) {
      return Number.POSITIVE_INFINITY;
    }
    let dpx = bola.p.x - this.p.x;
    let dpy = bola.p.y - this.p.y;
    let dvx = bola.v.x - this.v.x;
    let dvy = bola.v.y - this.v.y;
    let dpdv = dvx * dpx + dvy * dpy;
    if (dpdv > 0) {
      return Number.POSITIVE_INFINITY;
    }
    let dvdv = dvx * dvx + dvy * dvy;
    let dpdp = dpx * dpx + dpy * dpy;
    let R = bola.r + this.r;
    let D = dpdv * dpdv - dvdv * (dpdp - R * R);
    if (D < 0) {
      return Number.POSITIVE_INFINITY;
    }
    //console.log('Predicted: ' + (-(dpdv + Math.sqrt(D))/dvdv) )
    return -(dpdv + Math.sqrt(D)) / dvdv;
  }

  timeToHitVerticalWall(longitudCanvas: number) {
    if (this.v.x === 0) {
      return Number.POSITIVE_INFINITY;
    }
    if (this.v.x > 0) {
      return (longitudCanvas - this.r - this.p.x) / this.v.x;
    }
    return (this.r - this.p.x) / this.v.x;
  }

  timeToHitHorizontalWall(longitudCanvas: number) {
    if (this.v.y === 0) {
      return Number.POSITIVE_INFINITY;
    }
    if (this.v.y > 0) {
      return (longitudCanvas - this.r - this.p.y) / this.v.y;
    }
    return (this.r - this.p.y) / this.v.y;
  }

  // Resolución de la colisión
  bounceOff(bola: Bola) {
    let dpx = bola.p.x - this.p.x;
    let dpy = bola.p.y - this.p.y;
    let dvx = bola.v.x - this.v.x;
    let dvy = bola.v.y - this.v.y;
    let dpdv = dpx * dvx + dpy * dvy;
    let R = this.r + bola.r;
    let J = (2 * this.m * bola.m * dpdv) / ((this.m + bola.m) * R);
    let Jx = (J * dpx) / R;
    let Jy = (J * dpy) / R;
    this.v.x += Jx / this.m;
    this.v.y += Jy / this.m;
    bola.v.x -= Jx / bola.m;
    bola.v.y -= Jy / bola.m;
  }

  bounceOffVerticalWall() {
    this.v.x = -this.v.x;
  }

  bounceOffHorizontalWall() {
    this.v.y = -this.v.y;
  }
}
