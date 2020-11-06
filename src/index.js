import './index.pug';
import './plugin.js';

require.context('./components', true, /\.sass$/);
// function newConfig(num = 1234) {
//   const new_config = {
//     title: 'monthly average temperature',
//     diapason: {
//       full: false,
//     },
//     x: {
//       categories: new Array(num).fill(0).map((el, i) => i + 1),
//       title: 'indexes',
//     },
//     y: {
//       title: 'temperature',
//     },
//     series: [

//       {
//         name: 'qwer',
//         data: new Array(num).fill(0).map(() => (Math.random() * 100).toFixed(2) * 10),
//       },

//     ],
//   };
//   return new_config;
// }

// $('.root2').myChart(newConfig());
