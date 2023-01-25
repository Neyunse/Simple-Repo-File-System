const { Router } = require('express')
const endpoints = new Router()
const { r } = require('./endpoints')

endpoints.use("/repo", r)

module.exports = { endpoints }