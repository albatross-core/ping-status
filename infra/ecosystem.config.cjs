"use strict";
module.exports = {
  apps: [
    {
      name: "app",
      script: "bun",
      args: "run start:app",
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "/app/logs/api-error.log",
      out_file: "/app/logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
    {
      name: "pinger",
      script: "bun",
      args: "run start:pinger",
      cwd: "/app",
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: "1G",
      // Run every minute
      // cron_restart: "*/10 * * * *",
      error_file: "/app/logs/pinger-error.log",
      out_file: "/app/logs/pinger-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
