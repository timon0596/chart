export class View {
  constructor(data) {
    this.data = data;
    this.$canvas = $('<canvas>');
    this.data.$root.append(this.$canvas);
    this.context = this.$canvas[0].getContext('2d');
    this.w = this.data.$root[0].offsetWidth;
    this.h = this.data.$root[0].offsetHeight;
    this.drawCanvas();
    this.drawScaleY();
    this.addDelimiters();
  }

  drawCanvas() {
    this.$canvas[0].width = this.w;
    this.$canvas[0].height = this.h;
  }

  drawScaleY() {
    this.context.beginPath();
    this.context.moveTo(0, this.h);
    this.context.lineTo(this.w, this.h);
    this.context.stroke();
  }

  addDelimiters() {
    const lngt = this.w / this.data.x.categories.length;
    for (let i = 0; i < this.data.x.categories.length; i++) {
      const x = i === 0 ? lngt / 2 : lngt * i + lngt / 2;
      this.context.beginPath();
      this.context.moveTo(x, this.h);
      this.context.fillText(this.data.x.categories[i], x, this.h - this.h * 0.06);
      this.context.lineTo(x, this.h - this.h * 0.05);
      this.context.stroke();
    }
  }
}
