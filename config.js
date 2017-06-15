const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/rq',
    timeout: 3000
  },
  redis: {
    host: process.env.REDIS_DB_URI || 'localhost',
    port: 6379,
    password: '', // to be assigned on prod directly; do NOT push it to git.
    keys: {
      prefix: 'ID_'
    }
  }
}

module.exports = config
