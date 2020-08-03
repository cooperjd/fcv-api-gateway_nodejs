const express = require('express')
const router = express.Router()
const http = require('http')
let servicemap = require('./service-map')
const loadbalancer = require('./load-balancer')

router.all("/:name/*", (req, res, next) => {
    const requestedServiceName = req.params.name
    const requestedService = servicemap.registeredServices[requestedServiceName]
    let instance = requestedService.instances[0]

    if (requestedService.enabled) {
        if (requestedService.loadBalanceStrategy !== 'NONE' && requestedService.instances.length > 1) {
            instance = loadbalancer.getNextInstance(requestedService)
            requestedService.lastInstance = instance;
        }

        const remoteServiceRequestOptions = {
            'host': instance.host,
            'port': instance.port,
            'path': req.url,
            'method': req.method,
            'headers': req.headers
        }

        let remoteRequestObj = http.request(remoteServiceRequestOptions, (resp) => {
            let data = ''

            resp.on('data', (chunk) => {
                data += chunk
            })

            resp.on('end', () => {
                res.send(data)
            })
        })

        remoteRequestObj.on('error', (err) => {
            console.log("Error: " + err.message)
        })

        remoteRequestObj.end()
    }else{
        res.send({msg: 'Service ' + requestedServiceName +  ' is disabled.'})
    }
})

module.exports = router