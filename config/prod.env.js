'use strict'
module.exports = {
  NODE_ENV: '"production"',
  API_BASE_URL: process.env.API_BASE_URL || null,
  ROUTER_BASE_URL: process.env.ROUTER_BASE_URL || null,
  BUILD_PATH: process.env.BUILD_PATH || null,
  RELATIVE: process.env.RELATIVE || null,
  PORT: process.env.PORT || 8080
}
