const registrationUtil = require('./registered-services.json')
const fs = require('fs')

registrationUtil.addService = (newService) => {
    if (isServiceRegistered(newService.serviceName)) {
        return "Service " + JSON.stringify(newService) + " is already registered.\n"
            + "You can add new instances by making a post request to '/registration/register-instance' "
            + "Or you can delete the service by making a delete request to '/registration/deregister-service/:name'.\n"
    }

    if (newService.serviceName, newService.loadBalanceStrategy) {
        registrationUtil.registeredServices[newService.serviceName] = newService
        writeUpdatedMap()

        return "Successfully added " + newService.serviceName
    }

    return "Failed to register service. Please add these attributes to object:\n{\n"
        + "instances: [ARRAY]<{ host:[STRING], port:[STRING] }>,\n"
        + "serviceName: [STRING],\n"
        + "loadBalanceStrategy: [STRING],\n}\n"
}

registrationUtil.deleteService = (serviceName) => {
    let returnString = "Service " + serviceName + " is not registered.\n"

    if (isServiceRegistered(serviceName)) {
        returnString = "Failed to delete " + serviceName

        delete registrationUtil.registeredServices[serviceName]
        returnString = "Successfully deleted service: " + serviceName

        writeUpdatedMap()
    }

    return returnString
}

registrationUtil.addInstance = (serviceName, instance) => {
    let returnString = "Instance " + JSON.stringify(instance) + " is already registered under service '"
        + serviceName + "'.\n"

    if (!isServiceRegistered(serviceName)) {
        returnString = "Service with name '" + serviceName + "' is not registered."
    } else if (!isInstanceRegistered(serviceName, instance)) {
        returnString = "Failed to add instance: " + instance
        const service = registrationUtil.registeredServices[serviceName]
        service.instances.push(instance)
        returnString = "Successfully added instance: " + JSON.stringify(instance)

        writeUpdatedMap()
    }

    return returnString
}

registrationUtil.deleteInstance = (serviceName, instance) => {
    let returnString = "Service " + serviceName + " is not registered.\n"

    if (isInstanceRegistered(serviceName)) {
        returnString = "Failed to delete " + serviceName
        const service = registrationUtil.registeredServices[serviceName]
        const index = service.instances.indexOf(instance)
        service.instances.splice(index, 1)
        returnString = "Successfully deleted instance: " + JSON.stringify(instance)

        writeUpdatedMap()
    }

    return returnString
}

registrationUtil.setServiceEnabled = (serviceName, enabled) => {
    if (registrationUtil.registeredServices[serviceName].enabled !== enabled) {
        registrationUtil.registeredServices[serviceName].enabled = enabled
        writeUpdatedMap()
    }
}

registrationUtil.setServiceInstanceEnabled = (serviceName, index, enabled) => {
    if(registrationUtil.registeredServices[serviceName].instances[index].enabled !== enabled)
    registrationUtil.registeredServices[serviceName].instances[index].enabled = enabled
    writeUpdatedMap()
}

function isServiceRegistered(serviceName) {
    return registrationUtil.registeredServices[serviceName] ? true : false
}

function isInstanceRegistered(serviceName, instance) {
    if (registrationUtil.registeredServices[serviceName] === undefined) { return false }
    return registrationUtil.registeredServices[serviceName].instances.some(arrayInstance => {
        return JSON.stringify(arrayInstance) === JSON.stringify(instance)
    })
}

function writeUpdatedMap() {
    fs.writeFileSync("./registered-services-routes/registered-services.json", JSON.stringify(registrationUtil), (err) => {
        if (err) { throw err }
    })
}

module.exports = registrationUtil