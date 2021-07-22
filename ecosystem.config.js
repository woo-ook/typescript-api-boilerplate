module.exports = {
  apps: [
    {
      name: 'GBAI100 API Server',
      script: './build/index.bundle.js',
      watch: false,
      exec_mode: 'cluster',
      instances: 6,
      // wait_ready: true,
      listen_timeout: 5000,
      kill_timeout: 2000,
      autorestart: true,
      restart_delay: 1000,
      cron_restart: '0 0 * * *', // every day at 00:00
    },
  ],
};
