const baseUrl = 'http://localhost:3000/registration/'

function toggleService(event){
    const data = {
        serviceName: event.target.getAttribute('serviceName')
    }

    url = event.target.innerText === 'Enable' ? baseUrl + 'enable-service' : baseUrl + 'disable-service'

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res => {
        console.log("Request complete! response:", res)
        location.reload()
    })
}

function toggleInstance(event){
    const data = {
        serviceName: event.target.getAttribute('serviceName'),
        index: event.target.getAttribute('index')
    }

    url = event.target.innerText === 'Enable' ? baseUrl + 'enable-instance' : baseUrl + 'disable-instance'

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(res => {
        console.log("Request complete! response:", res)
        location.reload()
    })
}