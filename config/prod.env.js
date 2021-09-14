'use strict'
function transVal (val) {
  if (!val && val !== 0) {
    return null
  }
  if (val.indexOf('"') === -1) {
    return '"' + val + '"'
  }
  return val
}
module.exports = {
  NODE_ENV: '"production"',
  API_BASE_URL: transVal(process.env.API_BASE_URL),
  ROUTER_BASE_URL: transVal(process.env.ROUTER_BASE_URL),
  BUILD_PATH: transVal(process.env.BUILD_PATH),
  RELATIVE: process.env.RELATIVE,
  PORT: process.env.PORT || 8080
}
