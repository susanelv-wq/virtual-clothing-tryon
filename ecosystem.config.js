module.exports = {
  apps: [{
    name: 'virtual-tryon',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/virtual-clothing-tryon',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/virtual-tryon-error.log',
    out_file: '/var/log/pm2/virtual-tryon-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
