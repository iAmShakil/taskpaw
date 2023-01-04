module.exports = {
  apps: [
    {
      name: 'TaskPaw',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      env: {
        PORT: 8080,
        HOST: '0.0.0.0'
      }
    }
  ]
}
