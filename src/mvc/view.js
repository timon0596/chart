export class View {
  constructor(data) {
    this.data = data;
    this.$canvas = $('<canvas>');
    this.data.$root.append(this.$canvas);
    this.context = this.$canvas[0].getContext('2d');
    this.w = this.data.$root[0].offsetWidth;
    this.h = this.data.$root[0].offsetHeight;
    this.drawCanvas();
    this.drawAxises();
    this.addDelimitersX();
    this.addDelimitersY();
  }

  drawCanvas() {
    this.$canvas[0].width = this.w;
    this.$canvas[0].height = this.h;
  }

  drawAxises() {
    this.context.beginPath();
    this.context.moveTo(this.w * 0.1, 0);
    this.context.lineTo(this.w * 0.1, this.h * 0.85);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(this.w * 0.15, this.h * 0.9);
    this.context.lineTo(this.w, this.h * 0.9);
    this.context.stroke();
  }

  addDelimitersY() {
    let arr = [];
    this.data.series.forEach((el, i) => {
      arr = [...arr, ...el.data];
    });
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const diapason = max - min;
    for (let i = 0; i < 10; i++) {
      const offset = this.h * 0.85 - i * this.h * 0.85 / 10;
      this.context.beginPath();
      this.context.moveTo(this.w * 0.1, offset);
      this.context.lineTo(this.w * 0.08, offset);
      this.context.stroke();
      this.context.textAlign = 'center';
      this.context.fillText(min + diapason * (0.1 * (i + 1)), this.w * 0.05, offset);
    }
  }

  addDelimitersX() {
    for (let i = 0; i < this.data.x.categories.length; i++) {
      const offset = (this.w - this.w * 0.15) / this.data.x.categories.length;

      this.context.beginPath();
      this.context.moveTo(this.w * 0.15 + offset * i, this.h * 0.9);
      this.context.lineTo(this.w * 0.15 + offset * i, this.h * 0.95);
      this.context.stroke();
      this.context.textAlign = 'center';
      this.context.fillText(this.data.x.categories[i], this.w * 0.15 + offset * i, this.h * 0.95 + 10);
    }
  }
}
