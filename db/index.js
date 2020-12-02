const Pool = require('pg').Pool
const config = require('config')

const pool = new Pool(config.get('pool_settings'))

module.exports = pool