'use strict'
module.exports = {
  NODE_ENV: '"production"',
  API_BASE_URL: `'${process.env.API_BASE_URL || ""}'`,
  ROUTER_BASE_URL: `'${process.env.ROUTER_BASE_URL || ""}'`,
  BUILD_PATH: `'${process.env.BUILD_PATH || ""}'`
}
