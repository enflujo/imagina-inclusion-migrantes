/*
	Constructor de SimEvent
	---
	Acepta dos objetos Bola: a y b.
  Si la primera es nula, significa colisión con el muro vertical.
  Si la segunda es nula, significa colisión con el muro horizontal.
*/

import Bola from './Bola';

export default class SimEvent {
  time: number;
  a: Bola | null;
  b: Bola | null;

  constructor(time: number, a: Bola | null, b: Bola | null) {
    this.time = time;
    this.a = a;
    this.b = b;
  }

  compareTo(simEvent: SimEvent) {
    return this.time - simEvent.time;
  }

  isValid(simTime: number, ancho: number, alto: number) {
    // Nota: se usa toFixed(4) para evitar posibles errores de exactitud de floating-point
    let log = '';
    // Note: this check forces only one event at a given instant
    if (this.time < simTime) {
      log += 'Event precedes simulation time';
      //console.log(log);
      return false;
    }

    if (this.a === null) {
      if (this.b === null) return;
      // muro vertical
      log += 'Validating vertical wall.\n';
      log +=
        'Event time: ' +
        this.time.toFixed(4) +
        ', Fresh time: ' +
        (simTime + this.b.timeToHitVerticalWall(ancho)).toFixed(4) +
        '\n';
      //console.log(log);
      return this.time.toFixed(4) === (simTime + this.b.timeToHitVerticalWall(ancho)).toFixed(4);
    } else if (this.b === null) {
      log += 'Validating vertical wall.\n';
      log +=
        'Event time: ' +
        this.time.toFixed(4) +
        ', Fresh time: ' +
        (simTime + this.a.timeToHitVerticalWall(ancho)).toFixed(4) +
        '\n';
      //console.log(log);
      return this.time.toFixed(4) === (simTime + this.a.timeToHitHorizontalWall(alto)).toFixed(4);
    } else {
      // partícula-partícula
      log += 'Validating two-particle.\n';
      log +=
        'Event time: ' +
        this.time.toFixed(4) +
        ', Fresh time: ' +
        (simTime + this.a.timeToHit(this.b)).toFixed(4) +
        '\n';
      //console.log(log);
      return this.time.toFixed(4) === (simTime + this.a.timeToHit(this.b)).toFixed(4);
    }
  }

  ///
  /// TEMP FOR DEBUGGING:
  ///
  type() {
    if (this.a === null) {
      return 'vertical wall';
    }
    if (this.b === null) {
      return 'horizontal wall';
    }
    return 'ball';
  }
}
