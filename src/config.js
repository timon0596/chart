export const config = {
  title: 'monthly average temperature',
  x: {
    categories: new Array(1000).fill(0).map((el, i) => i + 1),
    title: 'points',
  },
  y: {
    title: 'temperature',
  },
  series: [
    {
      name: 'temp',
      data: new Array(1000).fill(0).map(() => (Math.random() * 100).toFixed(2) * 10000),
    },
    {
      name: 'feels_like',
      data: new Array(1000).fill(0).map(() => (Math.random() * 10).toFixed(2) * 10000),
    },
  ],
};
