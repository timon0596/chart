export class Slider {
  constructor(isSectionSlider) {
    this.isSectionSlider = isSectionSlider;
    this.chunkDistance;
    this.pos = [0, 1];
    this.mousedown = false;
    this.currentHandle = 0;
    this.el = $('<div>', { class: 'slider' });
    this.handles = new Array(2).fill(0).map(() => $('<div>', { class: 'handle' }));
    this.chunkHandle = $('<div>', { class: 'chunkHandle' });
    if (this.isSectionSlider) {
      this.el.append(this.chunkHandle);
      this.chunkHandle.mousedown(() => {
        this.mousedown = true;
      });
    } else {
      this.handles.forEach((el, i) => {
        this.el.append(el);
        el.mousedown((e) => {
          this.mousedown = true;
          this.currentHandle = i;
        });
      });
    }
    this.handleSliderMousemove = this.handleSliderMousemove.bind(this);
    $(window).mousemove(this.handleSliderMousemove);
    $(window).mouseup(() => {
      this.mousedown = false;
    });
  }

  setChunkDistance(value) {
    this.chunkDistance = value;
    this.chunkHandle.css('width', `${value}%`);
    console.log(value);
  }

  handleSliderMousemove(e) {
    if (this.mousedown) {
      if (this.isSectionSlider) {
        let x = (e.pageX - this.el[0].getBoundingClientRect().left)
         / this.el[0].getBoundingClientRect().width * 100;

        x = x + this.chunkDistance > 100
          ? (100 - this.chunkDistance) : x < 0
            ? 0 : x;
        this.chunkHandle.css('left', `${x}%`);
        this.computeChunkHandlePos();
      } else {
        let x = (e.pageX - this.el[0].getBoundingClientRect().left)
         / this.el[0].getBoundingClientRect().width * 100;

        x = x > 100
          ? 100 : x < 0
            ? 0 : x;
        this.handles[this.currentHandle].css('left', `${x}%`);
        this.computePos(this.currentHandle);
      }
      const event = $.Event('chart-scale-change');
      event.pos = {
        start: Math.min(...this.pos),
        end: Math.max(...this.pos),
      };
      $(this).trigger(event);
    }
  }

  computeChunkHandlePos() {
    const h = this.chunkHandle[0].getBoundingClientRect();
    const el = this.el[0].getBoundingClientRect();
    this.pos[0] = (h.left
        - el.left) / el.width;
    this.pos[0] = this.pos[0] < 0 ? 0 : this.pos[0];
    this.pos[1] = this.pos[0] + this.chunkDistance / 100;
  }

  setHandle({ i, position }) {
    this.handles[i].css('left', `${position}%`);
    this.computePos(i);
    const event = $.Event('chart-scale-change');
    event.pos = {
      start: Math.min(...this.pos),
      end: Math.max(...this.pos),
    };
    $(this).trigger(event);
  }

  setChunkHandle(pos) {
    this.chunkHandle.css('left', `${pos}%`);
    this.computeChunkHandlePos();
    const event = $.Event('chart-scale-change');
    event.pos = {
      start: Math.min(...this.pos),
      end: Math.max(...this.pos),
    };
    $(this).trigger(event);
  }

  setHandleWithoutTrigger({ i, pos }) {
    this.handles[i].css('left', `${pos}%`);
    this.computePos(i);
  }

  computePos(i) {
    const h = this.handles[i][0].getBoundingClientRect();
    const el = this.el[0].getBoundingClientRect();
    this.pos[i] = (h.left + h.width / 2
        - el.left) / el.width;
    this.pos[i] = this.pos[i] < 0 ? 0 : this.pos[i];
  }
}
