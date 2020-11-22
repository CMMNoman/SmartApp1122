const express = require('express')
const app = express()
const port = 3000

const User = require('./User')
const Ambulance = require('./Ambulance')
const Hospital = require('./Hospital')
const Incident = require('./Incident')
const Dispatcher = require('./Dispatcher')

app.get('/', (req, res) => res.send('SmartApp Api Works'))

app.use('/User', User)
app.use('/Ambulance', Ambulance)
app.use('/Hospital', Hospital)
app.use('/Incident', Incident)
app.use('/Dispatcher', Dispatcher)

app.use((req,res,next)=> {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
});

app.listen(port, () => { console.log(`SmartApp Api listening on port ${port}`) })