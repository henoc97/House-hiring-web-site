// ecosystem.config.js
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'house-hiring-web-site-http-redirect',
      script: 'src/redirectServer.js', //'src/server.js',
      instances: 1,
      exec_mode: 'cluster', // Activer le mode de clustering
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: process.env.PORT,
      },
    },
    {
      name: 'house-hiring-web-site-https-server',
      script: 'src/server.js', //'src/server.js',
      instances: 1,
      exec_mode: 'cluster', // Activer le mode de clustering
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: process.env.PORT,
      },
    },
  ],
};
