import { View } from './view2';
import { Model } from './model';

export class Controller {
  constructor(data) {
    this.view = new View(data);
    this.model = new Model(data);
    this.data = data;
    this.handleWindowMousemove = this.handleWindowMousemove.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    $(this.view.canvas).click(() => {
      console.log(this.view.dataCoords);
    });
    $(window).on('mousemove.intersection', this.handleWindowMousemove);
    $(window).resize(this.handleWindowResize);
  }

  handleWindowMousemove(e) {
    const x = e.pageX;
    const y = e.pageY;
    if (this.view.pointRadius > 1) {
      this.view.pointIntersection({ x, y, e });
    }
  }

  handleWindowResize() {
    this.view.reRender();
  }
}
