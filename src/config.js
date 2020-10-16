export const config = {
  title: 'monthly average temperature',
  x: {
    categories: new Array(100).fill(0).map((el, i) => i + 1),
  },
  y: {
    title: 'temperature',
  },
  series: [
    {
      name: 'temp',
      data: new Array(100).fill(0).map(() => (Math.random() * 10).toFixed(2)),
    },
    {
      name: 'feels_like',
      data: new Array(100).fill(0).map(() => (Math.random() * 10).toFixed(2)),
    },
  ],
};
