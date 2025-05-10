const app = require('./src/app')
const config = require('./src/configs/config')

const PORT = config.app.port || 3055

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`WSV booking courts start with port: http://0.0.0.0:${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})