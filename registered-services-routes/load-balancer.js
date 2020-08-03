const loadbalancer = {}

loadbalancer.getNextInstance = (requestedService) => {
    if(requestedService.lastInstance === undefined) { 
        requestedService.lastInstance = requestedService.instances[0]
        return requestedService.lastInstance
    }

    return updateInstance(requestedService.lastInstance, requestedService.instances, requestedService.loadBalanceStrategy)
}

function updateInstance(lastInstance, availableInstances, loadBalanceStrategy){
    let index = availableInstances.indexOf(lastInstance)

    switch(loadBalanceStrategy){
        case 'ROUND_ROBIN':
            index = handleRoundRobin(index, availableInstances)
            break
        case 'NONE':
            break
    }

    return availableInstances[index];
}

function handleRoundRobin(index, availableInstances){
    const nextIndex = index == availableInstances.length - 1 ? 0 : index + 1
    if(availableInstances[nextIndex].enabled){ return nextIndex }
    
    return handleRoundRobin(nextIndex, availableInstances)
}

module.exports = loadbalancer