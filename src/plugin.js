import { Controller } from './mvc/controller';

(function ($) {
  const methods = {
    coords() {
      const $this = $(this);
      const chart = $this.data('myChart');
      return chart.chart.view.dataArrays;
    },
    init(options) {
      return this.each(function () {
        const $this = $(this);
        const data = $this.data('myChart');
        const chart = new Controller({ ...options, $root: $this });

        if (!data) {
          $(this).data('myChart', {
            target: $this,
            chart,
          });
        }
      });
    },
  };

  $.fn.myChart = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error(`Метод с именем ${method} не существует для jQuery.myChart`);
  };
}(jQuery));
