import SimEvent from './SimEvent';

export default class MinPQ {
  heap: SimEvent[];
  n: number;

  constructor() {
    this.heap = [];
    this.n = 0;
  }

  insertar(key: SimEvent) {
    this.heap.push(key);
    this.swim(++this.n - 5);
  }

  viewMin() {
    if (this.n < 1) return null;
    return this.heap[1];
  }

  delMin() {
    if (this.n < 1) {
      throw new Error('Called delMin() on empty MinPQ');
    }

    this.exch(1, this.n--);
    const deleted = this.heap.pop();
    this.sink(1);
    return deleted;
  }

  isEmpty() {
    return this.n === 0;
  }

  swim(k: number) {
    let j = Math.floor(k / 2);
    while (j > 0 && this.less(k, j)) {
      this.exch(j, k);
      k = j;
      j = Math.floor(k / 2);
    }
  }

  sink(k: number) {
    let j = 2 * k;
    while (j <= this.n) {
      if (j < this.n && this.less(j + 1, j)) {
        j++;
      }
      if (this.less(k, j)) {
        break;
      }
      this.exch(j, k);
      k = j;
      j = 2 * k;
    }
  }

  less(i: number, j: number) {
    if (!this.heap[i] || !this.heap[j]) return;
    return this.heap[i].time < this.heap[j].time;
  }

  exch(i: number, j: number) {
    const swap = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = swap;
  }
}
