const app = require('./src/app')
const config = require('./src/configs/config')

const PORT = config.app.port || 3055

const server = app.listen(PORT, () => {
  console.log(`WSV booking courts start with port: http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})