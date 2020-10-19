import './index.pug';

import { config } from './config.js';
import './plugin.js';

require.context('./components', true, /\.sass$/);
const coords = $('.root').myChart(config);
$(window).click(() => {
  const arr = $('.root').myChart('coords');
  console.log(arr);
});
