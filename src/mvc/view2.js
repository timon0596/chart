import { Slider } from '../components/slider/slider';
import { Chartname } from '../components/chartname/chartname';

export class View {
  constructor(data) {
    this.timeOuts = [];
    this.chunkSections = 10;
    this.data = data;
    this.promises = [];
    this.font;
    this.min;
    this.max;
    this.diapason;
    this.sectionStartIndex;
    this.sectionEndIndex;
    this.sectionChunkStartIndex;
    this.sectionChunkEndIndex;
    this.startIndex;
    this.endIndex;
    this.chunks = 100;
    this.dataArrays = this.data.series.map((el) => el.data);
    // this.maxDataArrayLength = this.data.series.length > 1 ? this.dataArrays.reduce((a, el) => Math.max(a.length, el.length)) : this.data.series[0].data.length;
    this.maxDataArrayLength = this.data.series[0].data.length;

    this.sectionDiapason = this.maxDataArrayLength < 10000 ? this.maxDataArrayLength : this.maxDataArrayLength > 1000000 ? 50000 : 10000;
    this.colors = new Set();
    this.dataCoords = new Array(this.data.series.length).fill(0).map(() => []);
    this.sectionSlider = new Slider(true);
    this.chunkSlider = new Slider(false);
    this.canvas = $('<canvas>');
    this.$tip = $('<div>', { class: 'tip' });
    this.nameY = $('<div>', { class: 'nameY' });
    this.nameX = $('<div>', { class: 'nameX' });
    this.canvasWrapper = $('<div>', { class: 'canvasWrapper' });
    this.chartnames = $('<div>', { class: 'chartnames' });
    this.context = this.canvas[0].getContext('2d');
    this.mainWrapper = $('<div>', { class: 'mainWrapper' });
    this.chartnamesArray;
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
    !this.data.diapason.full ? this.init()
      : this.asyncInit();
  }

  init() {
    this.generateColor();
    this.elementsInit();
    this.defineSizes(this.canvasWrapper[0].getBoundingClientRect());
    this.canvasResize();
    this.minmaxData();
    this.renderAxises(this.axisesCoordinates);
    $(this.chunkSlider).on('chart-scale-change', (e) => {
      const statrtEndIndexes = this.getIndexesDiapason({ pos: e.pos, diapason: this.sectionEndIndex - this.sectionStartIndex });
      this.sectionChunkStartIndex = statrtEndIndexes.startIndex;
      this.sectionChunkEndIndex = statrtEndIndexes.endIndex;
      this.startIndex = this.sectionChunkStartIndex + this.sectionStartIndex;
      this.endIndex = this.sectionChunkEndIndex + this.sectionStartIndex;
      this.renderAllCharts({ startIndex: this.startIndex, endIndex: this.endIndex });
    });
    $(this.sectionSlider).on('chart-scale-change', (e) => {
      const statrtEndIndexes = this.getIndexesDiapason({ pos: e.pos, diapason: this.maxDataArrayLength });
      this.sectionStartIndex = statrtEndIndexes.startIndex;
      this.sectionEndIndex = statrtEndIndexes.endIndex;
      this.startIndex = this.sectionChunkStartIndex + this.sectionStartIndex;
      this.endIndex = this.sectionChunkEndIndex + this.sectionStartIndex;
      this.renderAllCharts({ startIndex: this.startIndex, endIndex: this.endIndex });
    });
    this.sectionSlider.setChunkHandle(0);
    this.chunkSlider.setHandle({ i: 0, position: 0 });
    this.chunkSlider.setHandle({ i: 1, position: 5 });
  }

  reRender() {
    this.defineSizes(this.canvasWrapper[0].getBoundingClientRect());
    this.canvasResize();
    this.renderAxises(this.axisesCoordinates);
    this.renderAllCharts({ startIndex: this.startIndex, endIndex: this.endIndex });
  }

  asyncReRender() {
    this.data.$root.html('');
    this.canvas = $('<canvas>');
    this.$tip = $('<div>', { class: 'tip' });
    this.nameY = $('<div>', { class: 'nameY' });
    this.nameX = $('<div>', { class: 'nameX' });
    this.canvasWrapper = $('<div>', { class: 'canvasWrapper' });
    this.chartnames = $('<div>', { class: 'chartnames' });
    this.context = this.canvas[0].getContext('2d');
    this.mainWrapper = $('<div>', { class: 'mainWrapper' });
    this.asyncInit();
  }

  asyncInit() {
    this.generateColor();
    this.elementsInit();
    this.defineSizes(this.canvasWrapper[0].getBoundingClientRect());
    this.canvasResize();
    this.minmaxData();
    this.renderAxises(this.axisesCoordinates);
    this.startIndex = 0;
    this.endIndex = this.maxDataArrayLength;
    this.renderAllCharts({ startIndex: this.startIndex, endIndex: this.endIndex });
  }

  mainWrapperAppending() {
    this.mainWrapper.append(this.canvasWrapper);
    !this.data.diapason.full ? this.mainWrapper.append(this.sectionSlider.el) : 0;
    !this.data.diapason.full ? this.mainWrapper.append(this.chunkSlider.el) : 0;
    this.mainWrapper.append(this.chartnames);
  }

  elementsInit() {
    this.nameY.append(this.data.y.title);
    this.data.$root.append(this.nameY);
    this.nameX.append(this.data.x.title);
    this.canvasWrapper
      .append(this.canvas)
      .append(this.nameX);

    this.mainWrapperAppending();

    this.canvasWrapper.append(this.$tip);
    this.chunkSlider.el.css('margin-top', '5px');
    this.data.$root.append(this.mainWrapper);
    this.chartnamesArray = new Array(this.data.series.length)
      .fill(0)
      .map((el, i) => {
        const color = this.colors[i];
        const { name } = this.data.series[i];
        const chartname = new Chartname({ color, name });
        this.chartnames.append(chartname.container);
        return chartname;
      });
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
    this.font = this.canvasHeight * 0.01 > 3 ? `${3}px` : `${this.canvasHeight * 0.01}px`;
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
    this.addDelimitersY();
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

  pointIntersection({ x, y, e }) {
    const br = this.canvas[0].getBoundingClientRect();
    let isIntersected = false;
    for (let index = 0; index < this.dataCoords.length; index++) {
      for (let i = 0; i < this.dataCoords[index].length; i++) {
        const xx = this.dataCoords[index][i].x + br.x;
        const yy = this.dataCoords[index][i].y + br.y;
        const radius = Math.sqrt((xx - x) ** 2 + (yy - y) ** 2);
        if (radius < this.pointRadius + 1) {
          this.$tip.text(this.dataCoords[index][i].val);
          isIntersected = true;
          this.$tip.css('left', `${e.clientX}px`);
          this.$tip.css('top', `${e.clientY}px`);
          break;
        }
      }
      if (isIntersected) {
        break;
      } else {
        this.$tip.text('');
      }
    }
  }

  drawPoint({
    data, index, i, offset, j,
  }) {
    const y = this.Yend.y - ((data[i] - this.min) / this.diapason * this.Yheight);

    const x = this.Xstart.x + offset * j;
    if (j > 0) {
      const prevY = this.Yend.y - ((data[i - 1] - this.min) / this.diapason * this.Yheight);
      const prevX = this.Xstart.x + offset * (j - 1);
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(prevX, prevY);
      this.context.strokeStyle = this.colors[index];
      this.context.stroke();
      this.context.closePath();
    }
    if (this.pointRadius > 1.5) {
      this.context.beginPath();
      this.context.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
      this.dataCoords[index].push({ x, y, val: data[i] });
      this.context.fillStyle = this.colors[index];
      this.context.fill();
    }
  }

  definePointRadius(lngt) {
    this.pointRadius = this.canvasHeight / lngt;
    this.pointRadius = this.pointRadius > 5 ? 5 : this.pointRadius;
    this.pointRadius = this.pointRadius < 1 ? 1 : this.pointRadius;
  }

  renderChartAsync({
    data, index, startIndex, endIndex,
  }) {
    const length = endIndex - startIndex;
    const offset = this.Xwidth / (endIndex - startIndex);
    const chunks = length > 10000 ? Math.ceil(length / 10000) : 1;
    const $this = this;
    const chunkLength = 10000;
    for (let j = 0; j < chunks; j++) {
      const promise = () => new Promise((res, rej) => {
        for (let i = 0; i < chunkLength; i++) {
          if ((chunkLength * j + i) < length) {
            this.drawPoint({
              data,
              index,
              i: chunkLength * j + i,
              offset,
              j: i + j * chunkLength,
            });
          }
        }
        res();
      });
      this.promises.push(promise);
    }
    this.promises.reduce((acc, cur) => acc.then(cur), Promise.resolve()).catch((e) => console.log(e));
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
    this.dataCoords = new Array(this.data.series.length).fill(0).map(() => []);
    this.definePointRadius(endIndex - startIndex);
    this.clearChart();
    this.dataArrays.forEach((data, index) => {
      const drawChartParametres = {
        data, index, startIndex, endIndex,
      };

      this.data.diapason.full ? this.renderChartAsync(drawChartParametres) : this.renderChart(drawChartParametres);
    });
    this.addDelimitersX({ startIndex, endIndex });
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

  addDelimitersY() {
    const exponent = ['Т', 'М'];

    for (let i = 0; i < 10; i++) {
      let divider = 1000;
      let order = 0;
      let value = (this.min + i * this.diapason / 9).toFixed(2);
      while (value / divider > 1) {
        divider *= divider;
        order++;
      }
      divider /= 1000;
      value = exponent[order - 1] ? ((value / (1000 ** order)).toFixed(1) + exponent[order - 1]) : value;
      const offset = this.Ystart.y + this.Yheight - i * this.Yheight / 9;
      this.context.beginPath();
      this.context.moveTo(this.Ystart.x, offset);
      this.context.lineTo(this.Ystart.x - 10, offset);
      this.context.stroke();
      this.context.font = this.font;
      this.context.textAlign = 'center';
      this.context.fillText(value, this.Ystart.x - 30, offset);
    }
  }

  addDelimitersX({ startIndex, endIndex }) {
    this.context.clearRect(this.Xstart.x - 10, this.Xstart.y + 1, this.canvasWidth, this.canvasHeight);
    const offset = (this.Xwidth) / (endIndex - startIndex);
    let offset2 = offset;
    const condition = ((endIndex - startIndex) > 1000) || (startIndex > 1000);
    const multiplicity2 = condition ? 2 : 1;
    let multiplicity = 1 * multiplicity2;
    while (offset2 < 20) {
      offset2 += offset;
      multiplicity += 1 * multiplicity2;
    }

    for (let i = startIndex; i < endIndex; i++) {
      if ((i + 1 - startIndex) % multiplicity !== 0) {
        continue;
      }
      this.context.beginPath();
      this.context.moveTo(this.Xstart.x + offset * (i - startIndex), this.Xstart.y);
      this.context.lineTo(this.Xstart.x + offset * (i - startIndex), this.Xstart.y + 10);
      this.context.strokeStyle = '#000';
      this.context.stroke();
      this.context.font = this.font;
      this.context.textAlign = 'center';
      this.context.fillStyle = '#000';

      this.context.fillText(
        this.data.x.categories[i],
        this.Xstart.x + offset * (i - startIndex),
        this.Xstart.y + 10 + 10,
      );
    }
  }
}
