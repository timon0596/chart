import { View } from './view';
import { Model } from './model';

export class Controller {
  constructor(data) {
    this.view = new View(data);
    this.model = new Model(data);
    this.data = data;
    this.handleCanvasMousemove = this.handleCanvasMousemove.bind(this);
    this.view.$canvas.mousemove(this.handleCanvasMousemove);
    $(this.view.slider).on('chart-scale-change', (e) => {
      const o = this.model.scaleFromTo(e.pos);
      this.view.drawScaleX(o);
      this.view.drawCharts(o);
    });
    this.view.drawScaleX({ startIndex: 0, endIndex: this.data.x.categories.length });
    this.view.drawCharts({ startIndex: 0, endIndex: this.data.x.categories.length });
  }

  handleCanvasMousemove(e) {
    const x = e.pageX;
    const y = e.pageY;
    this.view.pointIntersection({ x, y });
  }
}
