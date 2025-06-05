export class Ship {
  constructor(length, hits = 0, sunk = false) {
    (this.length = length), (this.hits = hits), (this.sunk = sunk);
  }
  hit(newHits) {
    this.hits += newHits;
    this.isSunk();
    return this;
  }
  isSunk() {
    if (this.length <= this.hits) {
      this.sunk = true;
    }
  }
}
