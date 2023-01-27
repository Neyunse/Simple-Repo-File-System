const { Router } = require('express')
const endpoints = new Router()
const { r, g } = require('./endpoints')

endpoints.use("/repo", r)
endpoints.use("/guest", g)

module.exports = { endpoints }