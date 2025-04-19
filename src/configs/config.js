`use strict`

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3055,
    jwt_secret_key: process.env.DEV_JWT_SECRET_KEY || 'dev'
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'booking_courts_db_dev'
  }
}

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3000,
    jwt_secret_key: process.env.PROD_JWT_SECRET_KEY || 'prod'
  },
  db: {
    host: process.env.PROD_DB_HOST || 'localhost',
    port: process.env.PROD_DB_PORT || 27017,
    name: process.env.PROD_DB_NAME || 'booking_courts_db_prod'
  }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]