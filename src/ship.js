export class Ship {
  constructor(length, hits = 0, sunk = false) {
    (this.length = length), (this.hits = hits), (this.sunk = sunk);
  }
  hit() {
    this.hits++;
    this.isSunk();
  }
  isSunk() {
    if (this.length <= this.hits) {
      this.sunk = true;
    }
  }
}
