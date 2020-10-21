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
      this.view.clearChart();
    });
  }

  handleWindowMousemove(e) {
    const x = e.pageX;
    const y = e.pageY;
  }

  handleWindowResize() {

  }
}
