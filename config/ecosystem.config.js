
// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: 'house-hiring-web-site-http-redirect',
        script:  'src/redirectServer.js', //'src/server.js',
        // instances: 4, // 'max', // Utiliser le maximum d'instances pour le clustering
        // exec_mode: 'cluster', // Activer le mode de clustering
        env_production: {
          NODE_ENV: 'production',
          PORT='3000'
        },
        env_development: {
          NODE_ENV: 'development',
          PORT='8443'
        },
      },
      {
        name: 'house-hiring-web-site-https-server',
        script:  'src/server.js', //'src/server.js',
        // instances: 4, // 'max', // Utiliser le maximum d'instances pour le clustering
        // exec_mode: 'cluster', // Activer le mode de clustering
        env_production: {
          NODE_ENV: 'production',
          PORT='3000'
        },
        env_development: {
          NODE_ENV: 'development',
          PORT='8443'
        },
      },
    ],
  };