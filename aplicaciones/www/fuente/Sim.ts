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
  cl: number;

  constructor(bolas: Bola[], cl: number) {
    if (bolas == null) {
      throw new Error('Sim constructor requires array of balls');
    }
    for (var i = 0; i < bolas.length; i++) {
      if (bolas[i] == null) {
        throw new Error('Invalid ball passed to Sim constructor');
      }
    }

    this.tiempo = 0;
    this.bolas = bolas;
    this.pq = new MinPQ();
    this.cl = cl;

    for (var i = 0; i < bolas.length; i++) {
      this.predictAll(this.bolas[i]);
    }
  }

  predictAll(bola: Bola) {
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
      this.pq.insert(new SimEvent(this.tiempo + dt, bola, this.bolas[i]));
      //console.log('Ball event inserted');
    }
    dt = bola.timeToHitVerticalWall(this.cl);
    if (isFinite(dt) && dt > 0) {
      //console.log('Vert event inserted');
      this.pq.insert(new SimEvent(this.tiempo + dt, null, bola));
    }
    dt = bola.timeToHitHorizontalWall(this.cl);
    if (isFinite(dt) && dt > 0) {
      //console.log('Horiz event inserted');
      this.pq.insert(new SimEvent(this.tiempo + dt, bola, null));
    }
  }
  predictBalls(ball: Bola) {
    if (ball == null) {
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

      dt = ball.timeToHit(this.bolas[i]);
      if (!isFinite(dt) || dt <= 0) {
        continue;
      }
      this.pq.insert(new SimEvent(this.tiempo + dt, ball, this.bolas[i]));
    }
  }

  predictVerticalWall(ball: Bola) {
    if (ball == null) {
      return;
    }
    var dt = ball.timeToHitVerticalWall(this.cl);
    if (isFinite(dt) && dt > 0) {
      //console.log('Vert event inserted');
      this.pq.insert(new SimEvent(this.tiempo + dt, null, ball));
    }
  }
  predictHorizontalWall(ball: Bola) {
    if (ball == null) {
      return;
    }
    var dt = ball.timeToHitHorizontalWall(this.cl);
    if (isFinite(dt) && dt > 0) {
      //console.log('Horiz event inserted');
      this.pq.insert(new SimEvent(this.tiempo + dt, ball, null));
    }
  }

  redibujar(ctx: CanvasRenderingContext2D) {
    const cl = this.cl;
    ctx.clearRect(0, 0, cl, cl);
    for (var i = 0; i < this.bolas.length; i++) {
      this.bolas[i].draw(ctx);
    }
  }

  // 'Increment' the simulation by time dt
  simulate(dt: number) {
    var simLog = 'Start time: ' + this.tiempo + '\n';
    var end = this.tiempo + dt;
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
      if (!minEvent.isValid(this.tiempo, this.cl)) {
        simLog += 'Invalid event: ' + minEvent.type() + '\n';
        continue;
      }

      simLog += 'Valid event: ' + minEvent.type() + '; ';
      inc = minEvent.time - this.tiempo;

      for (var i = 0; i < this.bolas.length; i++) {
        this.bolas[i].move(inc);
      }
      this.tiempo = minEvent.time;

      var a = minEvent.a;
      var b = minEvent.b;
      if (a !== null && b !== null) {
        a.bounceOff(b);
        simLog += 'Bounced off particle\n';
        this.predictAll(a);
        this.predictAll(b);
      } else if (a === null && b !== null) {
        b.bounceOffVerticalWall();
        simLog += 'Bounced off vertical\n';
        this.predictBalls(b);
        this.predictVerticalWall(b);
      } else {
        if (!a) return;
        a.bounceOffHorizontalWall();
        simLog += 'Bounced off horizontal\n';
        this.predictBalls(a);
        this.predictHorizontalWall(a);
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
    for (var i = 0; i < this.bolas.length; i++) {
      this.bolas[i].move(inc);
    }
    this.tiempo = end;

    //console.log(simLog);
  }
}
