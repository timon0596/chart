import './plugin.js';

function newConfig(num = 1234) {
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
        name: 'qwer',
        data: new Array(num).fill(0).map(() => (Math.random() * 100).toFixed(2) * 10),
      },

    ],
  };
  return new_config;
}
$('.root2').myChart({ ...newConfig(123123), diapason: { full: false } });
$('.root3').myChart({
  ...newConfig(50000),
  diapason: { full: true },
  series: [
    {
      name: 'qwer',
      data: new Array(5000000).fill(0).map((el, i) => (Math.sin(i * 0.001) * Math.exp(i * (0.000001))).toFixed(2)),
    },
  ],
  x: {
    categories: new Array(5000000).fill(0).map((el, i) => i + 1),
    title: 'indexes',
  },
});
