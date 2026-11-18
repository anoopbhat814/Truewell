module.exports = {
  apps: [
    {
      name: 'truewell-worker',
      script: 'src/index.js',
      instances: 1,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
