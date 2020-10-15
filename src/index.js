import './index.pug';
import 'jquery';
import { Controller } from './mvc/controller';

const axios = require('axios');

// const city = 'London';
// const key = 'c0fee748087a3b9cbc7ed8421e8cb3a3';
// axios.get('http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=60.99&lon=30.9&dt=1602460800&appid=466c0e09a3a341ca937dd3eb04f38e72').then((e) => {
//   localStorage.setItem('weather', JSON.stringify(e.data));
// });
const weather = JSON.parse(localStorage.getItem('weather'));
const config = {
  title: 'monthly average temperature',
  x: {
    categories: Object.keys(weather.hourly),
  },
  y: {
    title: 'temperature',
  },
  series: [
    {
      name: 'temp',
      data: weather.hourly.map((el) => el.temp),
    },
    {
      name: 'feels_like',
      data: weather.hourly.map((el) => el.feels_like),
    },
  ],
};
console.log(config);
require.context('./components', true, /\.sass$/); (function ($) {
  $.fn.myChart = function (options = {}) {
    const chart = new Controller({ ...options, $root: this });
    return this;
  };
}(jQuery));
$('.root').myChart(config);
