const WorkerPlugin = require('worker-plugin');

module.exports = {
  webpack: {
    plugins: { add: [new WorkerPlugin()] },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
