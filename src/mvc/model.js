export class Model {
  constructor(data) {
    this.data = data;
  }

  scaleFromTo({ start, end }) {
    const startIndex = Math.round(this.data.x.categories.length * start);
    const endIndex = Math.round(this.data.x.categories.length * end);
    return { startIndex, endIndex };
  }
}
