export const config = {
  title: 'monthly average temperature',
  diapason: {
    full: false,
  },
  x: {
    categories: new Array(1234).fill(0).map((el, i) => i + 1),
    title: 'indexes',
  },
  y: {
    title: 'temperature',
  },
  series: [
    {
      name: 'temp',
      data: new Array(1234).fill(0).map(() => (Math.random() * 100).toFixed(2) * 100),
    },
    {
      name: 'qwer',
      data: new Array(1234).fill(0).map(() => (Math.random() * 100).toFixed(2) * 10),
    },

  ],
};
