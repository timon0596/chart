import { View } from './view';
import { Model } from './model';

export class Controller {
  constructor(data) {
    this.view = new View(data);
    this.model = new Model(data);
    this.data = data;
    this.handleWindowMousemove = this.handleWindowMousemove.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    $(window).resize(this.handleWindowResize);
    $(window).mousemove(this.handleWindowMousemove);
    $(this.view.slider).on('chart-scale-change', (e) => {
      const o = this.model.scaleFromTo(e.pos);
      this.view.drawScaleX(o);
      this.view.drawCharts(o);
    });
    this.view.drawScaleX({ startIndex: 0, endIndex: this.data.x.categories.length });
    this.view.drawCharts({ startIndex: 0, endIndex: this.data.x.categories.length });
  }

  handleWindowMousemove(e) {
    const x = e.pageX;
    const y = e.pageY;
    this.view.pointIntersection({ x, y });
  }

  handleWindowResize() {
    this.view.render();
    const o = this.model.scaleFromTo({
      start: Math.min(...this.view.slider.pos),
      end: Math.max(...this.view.slider.pos),
    });
    this.view.drawScaleX(o);
    this.view.drawCharts(o);
  }
}
