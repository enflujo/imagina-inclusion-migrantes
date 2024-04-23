// /*
// 	Constructor de Sim
// */
import Bola from './Bola';
import MinPQ from './FilaPrioritaria';
import SimEvent from './SimEvent';

export default class Sim {
  tiempo: number;
  bolas: Bola[];
  pq: MinPQ;
  anchoLienzo: number;
  altoLienzo: number;
  cantidadMuros: number;
  bolasCoronadas: number;

  constructor(bolas: Bola[], anchoLienzo: number, altoLienzo: number, cantidadMuros: number) {
    if (bolas == null) {
      throw new Error('Sim constructor requires array of balls');
    }
    for (let i = 0; i < bolas.length; i++) {
      if (bolas[i] == null) {
        throw new Error('Invalid ball passed to Sim constructor');
      }
    }

    this.tiempo = 0;
    this.bolas = bolas;
    this.pq = new MinPQ();
    this.anchoLienzo = anchoLienzo;
    this.altoLienzo = altoLienzo;
    this.cantidadMuros = cantidadMuros;
    this.bolasCoronadas = 0;

    for (let i = 0; i < bolas.length; i++) {
      this.predecirTodo(this.bolas[i]);
    }
  }

  predecirTodo(bola: Bola) {
    if (bola == null) {
      return;
    }
    let dt;
    for (let i = 0; i < this.bolas.length; i++) {
      //
      //
      // Uncomment this once the wall collisions are working,
      // AND isValid() is complete.
      //
      //

      dt = bola.timeToHit(this.bolas[i]);
      if (!isFinite(dt) || dt <= 0) {
        continue;
      }
      this.pq.insertar(new SimEvent(this.tiempo + dt, bola, this.bolas[i]));
      //console.log('Ball event inserted');
    }
    dt = bola.timeToHitVerticalWall(this.anchoLienzo);
    if (isFinite(dt) && dt > 0) {
      //console.log('Vert event inserted');
      this.pq.insertar(new SimEvent(this.tiempo + dt, null, bola));
    }
    dt = bola.timeToHitHorizontalWall(this.altoLienzo);
    if (isFinite(dt) && dt > 0) {
      //console.log('Horiz event inserted');
      this.pq.insertar(new SimEvent(this.tiempo + dt, bola, null));
    }
  }
  predecirBolas(bola: Bola) {
    if (bola == null) {
      return;
    }
    let dt;
    for (let i = 0; i < this.bolas.length; i++) {
      //
      //
      // Uncomment this once the wall collisions are working,
      // AND isValid() is complete.
      //
      //

      dt = bola.timeToHit(this.bolas[i]);
      if (!isFinite(dt) || dt <= 0) {
        continue;
      }
      this.pq.insertar(new SimEvent(this.tiempo + dt, bola, this.bolas[i]));
    }
  }

  predecirMuroVertical(bola: Bola) {
    if (bola == null) {
      return;
    }
    let dt = bola.timeToHitVerticalWall(this.anchoLienzo);
    if (isFinite(dt) && dt > 0) {
      //console.log('Vert event inserted');
      this.pq.insertar(new SimEvent(this.tiempo + dt, null, bola));
    }
  }
  predecirMuroHorizontal(bola: Bola) {
    if (bola == null) {
      return;
    }
    let dt = bola.timeToHitHorizontalWall(this.altoLienzo);
    if (isFinite(dt) && dt > 0) {
      //console.log('Horiz event inserted');
      this.pq.insertar(new SimEvent(this.tiempo + dt, bola, null));
    }
  }

  redibujar(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.anchoLienzo, this.altoLienzo);
    for (let i = 0; i < this.bolas.length; i++) {
      const bola = this.bolas[i];
      bola.dibujar(ctx);
    }

    this.bolasCoronadas = this.bolas.reduce(
      (conteo, bola) => {
        if (!bola.activo) conteo += 1;
        return conteo;
      },
      0 - Math.ceil(this.cantidadMuros)
    );

    if (this.bolasCoronadas > 100 - this.cantidadMuros) {
      console.log('Fin de la simulación');
    }
    //console.log(this.bolasCoronadas);
  }

  // 'Increment' the simulation by time dt
  simulate(dt: number) {
    let simLog = 'Start time: ' + this.tiempo + '\n';
    let end = this.tiempo + dt;
    let minEvent;
    let inc;

    //let counter = 0;
    while (!this.pq.isEmpty()) {
      // Check min event time. If outside time window, break.
      // Otherwise, delete it. If not valid, continue.
      // Otherwise, process the event.
      minEvent = this.pq.viewMin();
      if (!minEvent) return;
      if (minEvent.time >= end) {
        simLog += 'No events in time window (min time: ' + minEvent.time + ')';
        break;
      }
      this.pq.delMin();
      if (!minEvent.isValid(this.tiempo, this.anchoLienzo, this.altoLienzo)) {
        simLog += 'Evento inválido: ' + minEvent.type() + '\n';
        continue;
      }

      simLog += 'Evento válido: ' + minEvent.type() + '; ';
      inc = minEvent.time - this.tiempo;

      for (let i = 0; i < this.bolas.length; i++) {
        this.bolas[i].mover(inc, this.anchoLienzo, this.altoLienzo);
      }
      this.tiempo = minEvent.time;

      let a = minEvent.a;
      let b = minEvent.b;
      if (a !== null && b !== null) {
        a.bounceOff(b);
        simLog += 'Bounced off particle\n';
        this.predecirTodo(a);
        this.predecirTodo(b);
      } else if (a === null && b !== null) {
        b.bounceOffVerticalWall();
        simLog += 'Bounced off vertical\n';
        this.predecirBolas(b);
        this.predecirMuroVertical(b);
      } else {
        if (!a) return;
        a.bounceOffHorizontalWall();
        simLog += 'Bounced off horizontal\n';
        this.predecirBolas(a);
        this.predecirMuroHorizontal(a);
      }

      /// TEMPORARY COUNTER
      /// for debugging
      /*counter++;
			if (counter > 5) {
				console.log(simLog);
				throw new Error('killed event process loop after ' + counter + ' executions');
			}*/
    }

    inc = end - this.tiempo;
    for (let i = 0; i < this.bolas.length; i++) {
      this.bolas[i].mover(inc, this.anchoLienzo, this.altoLienzo);
    }
    this.tiempo = end;
    //  console.log(this.tiempo);
    //console.log(simLog);
  }
}
