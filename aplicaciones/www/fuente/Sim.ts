/*
	Constructor de Sim
*/
import Bola from './Bola';
import MinPQ from './FilaPrioritaria';
import SimEvent from './SimEvent';

export default class Sim {
  bolas: Bola[];
  time: number;
  pq: MinPQ;

  constructor(bolas: Bola[], longitudCanvas: number) {
    if (bolas == null) {
      throw new Error('Sim constructor requires array of balls');
    }
    for (var i = 0; i < bolas.length; i++) {
      if (bolas[i] == null) {
        throw new Error('Invalid ball passed to Sim constructor');
      }
    }
    this.bolas = bolas;
    this.time = 0;
    this.bolas = bolas;
    this.pq = new MinPQ();
    for (var i = 0; i < this.bolas.length; i++) {
      this.predecirTodo(this.bolas[i], longitudCanvas);
    }
  }

  // function Sim(bolas: Bola[]) {
  //   if (bolas == null) {
  //     throw new Error('El constructor de Sim requiere un array de bolas');
  //   }
  //   for (var i = 0; i < bolas.length; i++) {
  //     if (bolas[i] == null) {
  //       throw new Error('Bola inválida pasada al constructor de Sim');
  //     }
  //   }

  // Crear nueva simulación
  //sim = new Sim(this.bolas, this.cl);

  predecirTodo(bola: Bola, longitudCanvas: number) {
    if (bola == null) {
      return;
    }
    var dt;
    for (var i = 0; i < this.bolas.length; i++) {
      //
      // Uncomment this once the wall collisions are working,
      // AND isValid() is complete.
      //

      dt = bola.timeToHit(this.bolas[i]);
      if (!isFinite(dt) || dt <= 0) {
        console.log('hola');
        continue;
      }
      this.pq.insert(new SimEvent(this.time + dt, bola, this.bolas[i]));
      console.log('Ball event inserted');
    }
    dt = bola.timeToHitVerticalWall(longitudCanvas);
    if (isFinite(dt) && dt > 0) {
      //console.log('Vert event inserted');
      this.pq.insert(new SimEvent(this.time + dt, null, bola));
    }
    dt = bola.timeToHitHorizontalWall(longitudCanvas);
    if (isFinite(dt) && dt > 0) {
      console.log('Horiz event inserted');
      this.pq.insert(new SimEvent(this.time + dt, bola, null));
    }
  }

  predictBalls(bola: Bola) {
    console.log('predictBalls');
    if (bola == null) {
      return;
    }
    var dt;
    for (var i = 0; i < this.bolas.length; i++) {
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
      this.pq.insert(new SimEvent(this.time + dt, bola, this.bolas[i]));
    }
  }

  predictVerticalWall(bola: Bola, longitudCanvas: number) {
    console.log('predictVerticalWall');
    if (bola == null) {
      return;
    }
    var dt = bola.timeToHitVerticalWall(longitudCanvas);
    if (isFinite(dt) && dt > 0) {
      console.log('Vert event inserted');
      this.pq.insert(new SimEvent(this.time + dt, null, bola));
    }
  }

  predictHorizontalWall(bola: Bola, longitudCanvas: number) {
    if (bola == null) {
      return;
    }
    var dt = bola.timeToHitHorizontalWall(longitudCanvas);
    if (isFinite(dt) && dt > 0) {
      console.log('Horiz event inserted');
      this.pq.insert(new SimEvent(this.time + dt, bola, null));
    }
  }

  redraw(ctx: CanvasRenderingContext2D | null, longitudCanvas: number) {
    if (!ctx) return;
    ctx.clearRect(0, 0, longitudCanvas, longitudCanvas);
    for (var i = 0; i < this.bolas.length; i++) {
      this.bolas[i].draw(ctx);
    }
  }

  // 'Increment' the simulation by time dt
  simulate(dt: number, longitudCanvas: number) {
    var simLog = 'Start time: ' + this.time + '\n';
    var end = this.time + dt;
    var minEvent;
    var inc;

    var counter = 0;

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
      if (!minEvent.isValid(this.time, longitudCanvas)) {
        simLog += 'Invalid event: ' + minEvent.type() + '\n';
        continue;
      }

      simLog += 'Valid event: ' + minEvent.type() + '; ';
      inc = minEvent.time - this.time;
      for (var i = 0; i < this.bolas.length; i++) {
        this.bolas[i].move(inc);
      }
      this.time = minEvent.time;

      var a = minEvent.a;
      var b = minEvent.b;
      if (a !== null && b !== null) {
        a.bounceOff(b);
        simLog += 'Bounced off particle\n';
        this.predecirTodo(a, longitudCanvas);
        this.predecirTodo(b, longitudCanvas);
      } else if (a === null && b !== null) {
        b.bounceOffVerticalWall();
        simLog += 'Bounced off vertical\n';
        this.predictBalls(b);
        this.predictVerticalWall(b, longitudCanvas);
      } else {
        if (!a) return;
        a.bounceOffHorizontalWall();
        simLog += 'Bounced off horizontal\n';
        this.predictBalls(a);
        this.predictHorizontalWall(a, longitudCanvas);
      }

      /// TEMPORARY COUNTER
      /// for debugging
      /*counter++;
              if (counter > 5) {
                  console.log(simLog);
                  throw new Error('killed event process loop after ' + counter + ' executions');
              }*/
    }

    inc = end - this.time;
    for (var i = 0; i < this.bolas.length; i++) {
      this.bolas[i].move(inc);
    }
    this.time = end;

    //console.log(simLog);
  }
}
