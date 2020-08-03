const express = require('express')
const { registeredServices } = require('../registered-services-routes/service-map')
const registrationUtil = require('../registered-services-routes/service-map')
const router = express.Router()

router.get('/', (req, res) => {
    const serviceNames = Object.keys(registeredServices)
    res.render('index', { serviceNames: serviceNames, registeredServices: registeredServices })
})

router.get('/update', (req, res) => {
    res.redirect('/')
})

module.exports = router