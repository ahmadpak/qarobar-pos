import config from '../electronStoreConfig'

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: config.get('dbFilePath')
  },
  useNullAsDefault: true
})

export default knex
