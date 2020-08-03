const express = require('express')
const helmet = require('helmet')
const registeredServiceRoutes = require('./registered-services-routes')
const registrationRoutes = require('./registration-routes')
const uiRoutes = require('./ui-routes')
const app = express()

app.use(express.json())
app.use(helmet())
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views/public'))
app.use('/api', registeredServiceRoutes)
app.use('/registration', registrationRoutes)
app.get('/', uiRoutes)

const PORT = process.env.PORT || '3000'
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})