import { Slider } from '../components/slider/slider.js';

export class View {
  constructor(data) {
    this.chunkSections = 10;
    this.data = data;
    this.min;
    this.max;
    this.diapason;
    this.sectionStartIndex;
    this.sectionEndIndex;
    this.sectionChunkStartIndex;
    this.sectionChunkEndIndex;
    this.startIndex;
    this.endIndex;
    this.sectionDiapason = 10000;
    this.chunks = 100;
    this.dataArrays = this.data.series.map((el) => el.data);
    this.maxDataArrayLength = this.dataArrays.reduce((a, el) => Math.max(a.length, el.length));
    this.colors = new Set();
    this.dataCoords = new Array(this.data.series.length).fill(0).map(() => []);
    this.sectionSlider = new Slider(true);
    this.chunkSlider = new Slider(false);
    this.canvas = $('<canvas>');
    this.canvas2 = $('<canvas>');
    this.canvasWrapper = $('<div>', { class: 'canvasWrapper' });
    this.context = this.canvas[0].getContext('2d');
    this.elementsInit();
    this.canvasWidth;
    this.canvasHeight;
    this.Xstart;
    this.Xend;
    this.Xwidth;
    this.Ystart;
    this.Yend;
    this.Yheight;
    this.axisesCoordinates;
    this.pointRadius = 2;
    this.init();
    $(this.chunkSlider).on('chart-scale-change', (e) => {
      const statrtEndIndexes = this.getIndexesDiapason({ pos: e.pos, diapason: this.sectionEndIndex - this.sectionStartIndex });
      this.sectionChunkStartIndex = statrtEndIndexes.startIndex;
      this.sectionChunkEndIndex = statrtEndIndexes.endIndex;
      this.startIndex = this.sectionChunkStartIndex + this.sectionStartIndex;
      this.endIndex = this.sectionChunkEndIndex + this.sectionStartIndex;
      // console.log(this.startIndex, this.endIndex);
      this.renderAllCharts({ startIndex: this.startIndex, endIndex: this.endIndex });
    });
    $(this.sectionSlider).on('chart-scale-change', (e) => {
      const statrtEndIndexes = this.getIndexesDiapason({ pos: e.pos, diapason: this.maxDataArrayLength });
      this.sectionStartIndex = statrtEndIndexes.startIndex;
      this.sectionEndIndex = statrtEndIndexes.endIndex;
      this.startIndex = this.sectionChunkStartIndex + this.sectionStartIndex;
      this.endIndex = this.sectionChunkEndIndex + this.sectionStartIndex;
      this.renderAllCharts({ startIndex: this.startIndex, endIndex: this.endIndex });
      console.log(this.startIndex, this.endIndex);
    });
    this.sectionSlider.setChunkHandle(0);
    this.chunkSlider.setHandle({ i: 0, position: 0 });
    this.chunkSlider.setHandle({ i: 1, position: 100 });
  }

  init() {
    this.generateColor();
    this.elementsInit();
    this.defineSizes(this.canvasWrapper[0].getBoundingClientRect());
    this.canvasResize();
    this.minmaxData();
    this.renderAxises(this.axisesCoordinates);
  }

  elementsInit() {
    this.canvasWrapper.append(this.canvas);
    this.canvasWrapper.append(this.sectionSlider.el);
    this.canvasWrapper.append(this.chunkSlider.el);
    this.chunkSlider.el.css('margin-top', '5px');
    this.data.$root.append(this.canvasWrapper);
  }

  defineSizes(wrapperBoundingRect) {
    this.canvasWidth = wrapperBoundingRect.width;
    this.canvasHeight = wrapperBoundingRect.height;
    this.Xstart = { x: this.canvasWidth * 0.15, y: this.canvasHeight * 0.85 };
    this.Xend = { x: this.canvasWidth * 0.9, y: this.canvasHeight * 0.85 };
    this.Xwidth = this.Xend.x - this.Xstart.x;
    this.Ystart = { x: this.canvasWidth * 0.1, y: this.canvasHeight * 0.05 };
    this.Yend = { x: this.canvasWidth * 0.1, y: this.canvasHeight * 0.75 };
    this.Yheight = this.Yend.y - this.Ystart.y;
    this.axisesCoordinates = {
      Xaxis: { start: this.Xstart, end: this.Xend },
      Yaxis: { start: this.Ystart, end: this.Yend },
    };
    const val = Math.round(this.sectionDiapason / this.maxDataArrayLength * 100);
    this.sectionSlider.setChunkDistance(val);
  }

  getIndexesDiapason({ pos, diapason }) {
    return { startIndex: Math.round(pos.start * diapason), endIndex: Math.round(pos.end * diapason) };
  }

  renderAxises({ Xaxis, Yaxis }) {
    this.renderYaxis(Yaxis);
    this.renderXaxis(Xaxis);
  }

  renderYaxis(axis) {
    this.context.beginPath();
    this.context.moveTo(axis.start.x, axis.start.y);
    this.context.lineTo(axis.end.x, axis.end.y);
    this.context.stroke();
    this.addDelimitersY(axis);
  }

  renderXaxis(axis) {
    this.context.beginPath();
    this.context.moveTo(axis.start.x, axis.start.y);
    this.context.lineTo(axis.end.x, axis.end.y);
    this.context.stroke();
  }

  canvasResize() {
    this.canvas[0].width = this.canvasWidth;
    this.canvas[0].height = this.canvasHeight;
  }

  minmaxData() {
    let arr = [];
    this.dataArrays.forEach((el, i) => {
      arr = [...arr, ...el];
    });
    this.max = arr.reduce((a, b) => Math.max(a, b));
    this.min = arr.reduce((a, b) => Math.min(a, b));
    this.diapason = this.max - this.min;
  }

  addDelimitersY(axis) {
    this.context.beginPath();
    this.context.font = this.h * 0.01 > 3 ? `${3}px` : `${this.h * 0.01}px`;
    this.context.textAlign = 'center';
    this.context.fillText(this.max, axis.start.x - 10, axis.start.y);
    this.context.beginPath();
    this.context.font = this.h * 0.01 > 3 ? `${3}px` : `${this.h * 0.01}px`;
    this.context.textAlign = 'center';
    this.context.fillText(this.min, axis.end.x - 10, axis.end.y);
  }

  drawPoint({
    data, index, i, offset, j,
  }) {
    const y = this.Yend.y - ((data[i] - this.min) / this.diapason * this.Yheight);

    const x = this.Xstart.x + offset * j;
    if (j > 0) {
      const prevY = this.Yend.y - ((data[i - 1] - this.min) / this.diapason * this.Yheight);
      const prevX = this.Xstart.x + offset * (j - 1);
      this.context.lineTo(x, y);
      this.context.strokeStyle = this.colors[index];
      this.context.stroke();
    }
    this.context.beginPath();
    this.context.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    this.dataCoords[index].push({ x, y, val: data[i] });
    this.context.fillStyle = this.colors[index];
    this.context.fill();
  }

  renderChartAsync({
    data, index, startIndex, endIndex,
  }) {
    const length = endIndex - startIndex;
    const offset = this.Xwidth / (endIndex - startIndex);
    const chunks = length > 10000 ? this.chunks : 1;
    const $this = this;
    const chunkLength = length > 10000 ? length / this.chunks : length;
    for (let j = 0; j < chunks; j++) {
      setTimeout((param) => {
        for (let i = 0; i < chunkLength; i++) {
          setTimeout(this.drawPoint.bind($this), 0, {
            data, index, i: chunkLength * j + i, offset,
          });
        }
      }, 0, j);
    }
  }

  renderChart({
    data, index, startIndex, endIndex,
  }) {
    const offset = this.Xwidth / (endIndex - startIndex);
    const arr = data.slice(startIndex, endIndex);
    for (let i = startIndex; i < endIndex; i++) {
      const j = i - startIndex;
      this.drawPoint({
        data,
        index,
        i,
        offset,
        j,
      });
    }
  }

  renderAllCharts({ startIndex, endIndex }) {
    this.clearChart();
    // const pointsAmount = this.dataArrays.reduce((a, el) => a.length + el.length);

    // const chunkLength = this.maxDataArrayLength / this.chunkSections;
    console.log(startIndex);
    console.log(endIndex);
    this.dataArrays.forEach((data, index) => {
      const drawChartParametres = {
        data, index, startIndex, endIndex,
      };

      this.renderChart(drawChartParametres);
    });
  }

  clearChart() {
    this.context.clearRect(this.Xstart.x - 2 * this.pointRadius, 0, this.canvasWidth, this.Yheight + this.Ystart.y + 2 * this.pointRadius);
  }

  generateColor() {
    while (this.colors.size < this.data.series.length) {
      this.colors.add(`rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},1)`);
    }
    this.colors = Array.from(this.colors);
  }
}
