import './index.pug';

import { config } from './config.js';
import './plugin.js';

require.context('./components', true, /\.sass$/);
function newConfig(num = 54321) {
  const new_config = {
    title: 'monthly average temperature',
    diapason: {
      full: false,
    },
    x: {
      categories: new Array(num).fill(0).map((el, i) => i + 1),
      title: 'indexes',
    },
    y: {
      title: 'temperature',
    },
    series: [
      {
        name: 'temp',
        data: new Array(num).fill(0).map(() => (Math.random() * 100).toFixed(2) * 100),
      },
      {
        name: 'qwer',
        data: new Array(num).fill(0).map(() => (Math.random() * 100).toFixed(2) * 10),
      },

    ],
  };
  return new_config;
}
$('.root1').myChart(config);
$('.root2').myChart({ ...newConfig(123123), diapason: { full: false } });
$('.root3').myChart({ ...newConfig(), diapason: { full: true } });
$('.root4').myChart({ ...newConfig(1234000), diapason: { full: false } });
