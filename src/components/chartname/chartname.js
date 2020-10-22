export class Chartname {
  constructor({ color, name }) {
    this.container = $('<div>', { class: 'chartname' });
    this.chartname = $('<div>', { class: 'chartname__text' });
    this.chartnameColor = $('<div>', { class: 'chartname__color' });
    this.color = color;
    this.name = name;
    this.init();
  }

  init() {
    this.container
      .append(this.chartnameColor)
      .append(this.chartname);
    this.chartname.text(this.name);
    this.chartnameColor.css('background', this.color);
  }
}
