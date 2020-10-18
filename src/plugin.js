import { Controller } from './mvc/controller';

(function ($) {
  $.fn.myChart = function (options = {}) {
    const chart = new Controller({ ...options, $root: this });
    return this;
  };
}(jQuery));
