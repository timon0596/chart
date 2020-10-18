import { Slider } from '../components/slider/slider.js';

export class View {
  constructor(data) {
    this.data = data;
    this.min;
    this.max;
    this.diapason;
    this.colors = new Set();
    this.dataCoords = new Array(this.data.series.length).fill(0).map(() => []);
    this.slider = new Slider();
    this.$tip = $('<div>', { class: 'tip' });
    this.$nameY = $('<div>', { class: 'nameY' });
    this.$nameX = $('<div>', { class: 'nameX' });
    this.$chartNames = $('<div>', { class: 'chartNames' });
    this.$chartNamesArray = [];
    this.$chartNameColorsArray = [];
    this.$canvas = $('<canvas>');
    this.$wrapper = $('<div>', { class: 'wrapper' });
    this.$mainwrapper = $('<div>', { class: 'mainwrapper' });

    this.$nameX.text(this.data.x.title);
    this.$nameY.text(this.data.y.title);

    this.data.$root.append(this.$mainwrapper);
    this.$mainwrapper.append(this.$nameY);
    this.$mainwrapper.append(this.$wrapper);
    this.$wrapper.append(this.$canvas);
    this.$mainwrapper.append(this.$tip);
    this.$mainwrapper.append(this.slider.el);
    this.$mainwrapper.append(this.$nameX);
    this.$mainwrapper.append(this.$chartNames);

    this.data.series.forEach((el, i) => {
      this.$chartNamesArray.push($('<div>', { class: 'chartName' }));
      this.$chartNameColorsArray.push($('<div>', { class: 'chartNameColor' }));
      this.$chartNames.append(this.$chartNamesArray[i]);
      this.$chartNamesArray[i].append(this.$chartNameColorsArray[i]);
      this.$chartNamesArray[i].append(this.data.series[i].name);
    });

    this.context = this.$canvas[0].getContext('2d');
    this.w = this.$wrapper[0].offsetWidth;
    this.h = this.$wrapper[0].offsetHeight;
    this.pointRadius;
    this.offsetX = (this.w - this.w * 0.15) / this.data.x.categories.length;

    this.definePointRadius(this.data.x.categories.length);
    this.generateColor();
    this.minmaxData();
    this.drawCanvas();
    this.axisY();
    this.addDelimitersY();
    this.axisX();
  }

  definePointRadius(lngt) {
    this.pointRadius = this.h / lngt;
    this.pointRadius = this.pointRadius > 5 ? 5 : this.pointRadius;
    this.pointRadius = this.pointRadius < 1 ? 1 : this.pointRadius;
  }

  drawCharts(o) {
    this.definePointRadius(o.endIndex - o.startIndex);
    this.dataCoords = new Array(this.data.series.length).fill(0).map(() => []);
    this.context.clearRect(this.w * 0.1, 0, this.w, this.h * 0.9 - 2);
    this.data.series.forEach((el, i) => {
      this.drawChart({ data: el.data, index: i, ...o });
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
      this.context.font = this.h * 0.01 > 3 ? `${3}px` : `${this.h * 0.01}px`;
      this.context.textAlign = 'center';
      this.context.fillText((this.min + i * this.diapason / 9).toFixed(2), this.w * 0.05, offset);
    }
  }

  drawChart({
    data, index, startIndex, endIndex,
  }) {
    this.context.beginPath();
    const arr = data.slice(startIndex, endIndex);
    arr.forEach((el, i) => {
      const y = this.h * 0.85
      - ((el - this.min) / this.diapason * this.h * 0.8);
      const offset = (this.w - this.w * 0.15) / (endIndex - startIndex);
      if (arr[i + 1] !== undefined) {
        const nextY = this.h * 0.85
        - ((arr[i + 1] - this.min) / this.diapason * this.h * 0.8);
        this.context.beginPath();
        this.context.moveTo(this.w * 0.15 + offset * i, y);
        this.context.lineTo(this.w * 0.15 + offset * (i + 1), nextY);
        this.context.strokeStyle = this.colors[index];
        this.context.stroke();
      }
      this.context.beginPath();
      this.context.arc(this.w * 0.15 + offset * i, y, this.pointRadius, 0, 2 * Math.PI);
      this.dataCoords[index].push({ x: (this.w * 0.15 + offset * i), y, val: el });
      this.context.fillStyle = this.colors[index];
      this.context.fill();
    });
  }

  generateColor() {
    while (this.colors.size < this.data.series.length) {
      this.colors.add(`rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`);
    }
    this.colors = Array.from(this.colors);
    this.$chartNameColorsArray.forEach((el, i) => {
      el.css('background', this.colors[i]);
    });
  }

  pointIntersection({ x, y }) {
    const br = this.$canvas[0].getBoundingClientRect();
    this.dataCoords.forEach((arr) => {
      for (let i = 0; i < arr.length; i++) {
        const xx = arr[i].x + br.x;
        const yy = arr[i].y + br.y;
        const radius = Math.sqrt((xx - x) ** 2 + (yy - y) ** 2);
        if (radius < this.pointRadius + 1) {
          this.$tip.text(arr[i].val);
          break;
        }
      }
    });
  }

  drawScaleX({ startIndex, endIndex }) {
    this.context.clearRect(this.w * 0.15 - 10, this.h * 0.9, this.w, this.h);
    const offset = (this.w - this.w * 0.15) / (endIndex - startIndex);
    let offset2 = (this.w - this.w * 0.15) / (endIndex - startIndex);
    let multiplicity = 1;
    while (offset2 < (this.w - this.w * 0.15) / 20) {
      offset2 += (this.w - this.w * 0.15) / (endIndex - startIndex);
      multiplicity += 1;
    }

    for (let i = startIndex; i < endIndex; i++) {
      if ((i + 1 - startIndex) % multiplicity !== 0) {
        continue;
      }
      this.context.beginPath();
      this.context.moveTo(this.w * 0.15 + offset * (i - startIndex), this.h * 0.9);
      this.context.lineTo(this.w * 0.15 + offset * (i - startIndex), this.h * 0.95);
      this.context.strokeStyle = '#000';
      this.context.stroke();
      this.context.font = this.h * 0.01 > 3 ? `${3}px` : `${this.h * 0.01}px`;
      this.context.textAlign = 'center';
      this.context.fillStyle = '#000';
      this.context.fillText(
        this.data.x.categories[i],
        this.w * 0.15 + offset * (i - startIndex),
        this.h * 0.95 + 10,
      );
    }
  }
}
