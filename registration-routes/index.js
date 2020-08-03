const express = require('express')
const router = express.Router()

const registrationUtil = require("../registered-services-routes/service-map")


router.post("/register-service", (req, res, next) => {
    const newService = req.body
    res.send(registrationUtil.addService(newService))
})

router.delete("/deregister-service/:name", (req, res, next) => {
    const serviceName = req.params.name
    res.send(registrationUtil.deleteService(serviceName))
})

router.post("/register-instance", (req, res, next) => {
    const serviceName = req.body.serviceName
    const instance = req.body.instance
    res.send(registrationUtil.addInstance(serviceName, instance))
})

router.delete("/deregister-instance", (req, res, next) => {
    const serviceName = req.body.serviceName
    const instance = req.body.instance
    res.send(registrationUtil.deleteInstance(serviceName, instance))
})

router.post('/enable-service', (req, res) => {
    const service = req.body
    registrationUtil.setServiceEnabled(service.serviceName, true)
    res.send('successfully enabled ' + service.serviceName)
})

router.post('/disable-service', (req, res) => {
    const service = req.body
    registrationUtil.setServiceEnabled(service.serviceName, false)
    res.send('successfully disabled ' + service.serviceName)
})

router.post('/enable-instance', (req, res) => {
    const service = req.body
    registrationUtil.setServiceInstanceEnabled(service.serviceName, service.index, true)
    res.send('successfully enabled ' + service.serviceName + ' -> ' + registrationUtil.registeredServices[service.serviceName].instances[service.index])
})

router.post('/disable-instance', (req, res) => {
    const service = req.body
    registrationUtil.setServiceInstanceEnabled(service.serviceName, service.index, false)
    res.send('successfully disabled ' + service.serviceName + ' -> ' + registrationUtil.registeredServices[service.serviceName].instances[service.index])
})

module.exports = router