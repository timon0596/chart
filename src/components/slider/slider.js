export class Slider {
  constructor() {
    this.distance = 0;
    this.segment = 0;
    this.pos = [0, 1];
    this.mousedown = false;
    this.currentHandle = 0;
    this.el = $('<div>', { class: 'slider' });
    this.handles = new Array(2).fill(0).map(() => $('<div>', { class: 'handle' }));
    this.handles.forEach((el, i) => {
      this.el.append(el);
      el.mousedown((e) => {
        this.mousedown = true;
        this.currentHandle = i;
      });
    });
    this.handleSliderMousemove = this.handleSliderMousemove.bind(this);
    $(window).mousemove(this.handleSliderMousemove);
    $(window).mouseup(() => {
      this.mousedown = false;
    });
  }

  handleSliderMousemove(e) {
    if (this.mousedown) {
      let x = e.pageX - this.el[0].getBoundingClientRect().left;

      x = x > this.el[0].offsetWidth
        ? this.el[0].offsetWidth : x < 0
          ? 0 : x;
      this.handles[this.currentHandle].css('left', `${x}px`);
      this.computeDistance();
      this.computePos(this.currentHandle);
      const event = $.Event('chart-scale-change');
      event.pos = {
        start: Math.min(...this.pos),
        end: Math.max(...this.pos),
      };
      $(this).trigger(event);
    }
  }

  computeDistance() {
    this.distance = Math.abs(this.handles[0][0].getBoundingClientRect().left
     - this.handles[1][0].getBoundingClientRect().left);
    this.segment = this.distance / this.el[0].getBoundingClientRect().width;
  }

  computePos(i) {
    this.pos[i] = (this.handles[i][0].getBoundingClientRect().left
        - this.el[0].getBoundingClientRect().left) / this.el[0].getBoundingClientRect().width;
    this.pos[i] = this.pos[i] < 0 ? 0 : this.pos[i];
  }
}
