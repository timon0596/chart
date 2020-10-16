import { Slider } from '../components/slider/slider.js';

export class View {
  constructor(data) {
    this.data = data;
    this.min;
    this.max;
    this.diapason;
    this.colors = new Set();
    this.dataCoords = [];

    this.slider = new Slider();
    this.$tip = $('<div>', { class: 'tip' });
    this.$canvas = $('<canvas>');
    this.$wrapper = $('<div>', { class: 'wrapper' });
    this.$mainwrapper = $('<div>', { class: 'mainwrapper' });

    this.data.$root.append(this.$mainwrapper);
    this.$mainwrapper.append(this.$wrapper);
    this.$wrapper.append(this.$canvas);
    this.$mainwrapper.append(this.$tip);
    this.$mainwrapper.append(this.slider.el);

    this.context = this.$canvas[0].getContext('2d');
    this.w = this.$wrapper[0].offsetWidth;
    this.h = this.$wrapper[0].offsetHeight;
    this.offsetX = (this.w - this.w * 0.15) / this.data.x.categories.length;
    this.generateColor();
    this.minmaxData();
    this.drawCanvas();
    this.axisY();
    this.axisX();
    this.addDelimitersX();
    this.addDelimitersY();
    this.drawCharts();
  }

  drawCharts() {
    this.data.series.forEach((el, i) => {
      this.drawChart({ data: el.data, index: i });
    });
  }

  drawCanvas() {
    this.$canvas[0].width = this.w;
    this.$canvas[0].height = this.h;
  }

  axisY() {
    this.context.beginPath();
    this.context.moveTo(this.w * 0.1, this.h * 0.05);
    this.context.lineTo(this.w * 0.1, this.h * 0.85);
    this.context.stroke();
  }

  axisX() {
    this.context.beginPath();
    this.context.moveTo(this.w * 0.15, this.h * 0.9);
    this.context.lineTo(this.w, this.h * 0.9);
    this.context.stroke();
  }

  minmaxData() {
    let arr = [];
    this.data.series.forEach((el, i) => {
      arr = [...arr, ...el.data];
    });
    this.max = Math.max(...arr);
    this.min = Math.min(...arr);
    this.diapason = this.max - this.min;
  }

  addDelimitersY() {
    for (let i = 0; i < 10; i++) {
      const offset = this.h * 0.85 - i * this.h * 0.8 / 9;
      this.context.beginPath();
      this.context.moveTo(this.w * 0.1, offset);
      this.context.lineTo(this.w * 0.08, offset);
      this.context.stroke();
      this.context.textAlign = 'center';
      this.context.fillText((this.min + i * this.diapason / 9).toFixed(2), this.w * 0.05, offset);
    }
  }

  addDelimitersX() {
    for (let i = 0; i < this.data.x.categories.length; i++) {
      this.context.beginPath();
      this.context.moveTo(this.w * 0.15 + this.offsetX * i, this.h * 0.9);
      this.context.lineTo(this.w * 0.15 + this.offsetX * i, this.h * 0.95);
      this.context.stroke();
      this.context.textAlign = 'center';
      this.context.fillText(this.data.x.categories[i], this.w * 0.15 + this.offsetX * i, this.h * 0.95 + 10);
    }
  }

  drawChart({ data, index }) {
    this.context.beginPath();
    data.forEach((el, i) => {
      const y = this.h * 0.85
      - ((el - this.min) / this.diapason * this.h * 0.8);
      if (data[i + 1] !== undefined) {
        const nextY = this.h * 0.85
        - ((data[i + 1] - this.min) / this.diapason * this.h * 0.8);
        this.context.beginPath();
        this.context.moveTo(this.w * 0.15 + this.offsetX * i, y);
        this.context.lineTo(this.w * 0.15 + this.offsetX * (i + 1), nextY);
        this.context.strokeStyle = this.colors[index];
        this.context.stroke();
      }
      this.context.beginPath();
      this.context.arc(this.w * 0.15 + this.offsetX * i, y, 5, 0, 2 * Math.PI);
      this.dataCoords.push({ x: this.w * 0.15 + this.offsetX * i, y, val: el });
      this.context.fillStyle = this.colors[index];
      this.context.fill();
    });
  }

  generateColor() {
    while (this.colors.size < this.data.series.length) {
      this.colors.add(`rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`);
    }
    this.colors = Array.from(this.colors);
  }

  pointIntersection({ x, y }) {
    const br = this.$canvas[0].getBoundingClientRect();
    this.dataCoords.forEach((el) => {
      const xx = el.x + br.x;
      const yy = el.y + br.y;
      const radius = Math.sqrt((xx - x) ** 2 + (yy - y) ** 2);
      radius < 10 ? this.$tip.text(el.val) : 0;
    });
  }

  drawScaleX({ startIndex, endIndex }) {
    this.context.clearRect(this.w * 0.15 - 10, this.h * 0.9, this.w, this.h);
    for (let i = startIndex; i < endIndex; i++) {
      const offset = (this.w - this.w * 0.15) / (endIndex - startIndex);
      this.context.beginPath();
      this.context.moveTo(this.w * 0.15 + offset * (i - startIndex), this.h * 0.9);
      this.context.lineTo(this.w * 0.15 + offset * (i - startIndex), this.h * 0.95);
      this.context.stroke();
      this.context.textAlign = 'center';
      this.context.fillText(
        this.data.x.categories[i],
        this.w * 0.15 + offset * (i - startIndex),
        this.h * 0.95 + 10,
      );
    }
  }
}
