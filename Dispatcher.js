const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const connectDB = require('./DBConnection')
const common = require('./common')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/AssignAmbulancesHospital', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { iid, hid, aids } = req.body
      var requiredFields = ''
      if (iid === undefined || iid === '') {
        requiredFields += 'Incident ID, '
      } if (hid === undefined || hid === '') {
        requiredFields += 'Hospital ID, '
      } if (aids === undefined || aids === '') {
        requiredFields += 'Ambulance ID\'s, '
      } if (requiredFields) {
        
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.all(`INSERT INTO ASSIGNED_AMBULANCE_HOSPITAL (IID, HID, AIDS) VALUES ('${iid}', '${hid}', '${aids}')`, (error, result, fields) => {
          if (error) {
            
            res.status(400).send({ error: error })
          } else {
            var aidsJoin = ''
            aids.split(',').forEach((aid) => {
              aidsJoin += `'${aid}',`
            })
            aidsJoin = aidsJoin.substr(0, aidsJoin.length - 1)
            response.all(`UPDATE AMBULANCE SET STATUS = 'Assigned' WHERE ID IN (${aidsJoin})`)
            response.all(`UPDATE INCIDENT SET STATUS = 'Active' WHERE ID = '${iid}'`, (error, result, fields) => {
              if (error) {
                
                res.status(400).send({ error: error })
              } else {
                
                res.send({ message: 'Dispatched Successfully' })
              }
            })
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetAll', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      response.all(`SELECT * FROM USER WHERE ROLE = 'DISPATCHER'`, (error, result, fields) => {
        if (error) {
          
          res.status(400).send({ error: error })
        } else {
          
          res.send({ dispatchers: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/Delete/:UID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { UID } = req.params
      response.all(`DELETE FROM USER WHERE ROLE = 'DISPATCHER' AND ID = '${UID}'`, (error, result, fields) => {
        if (error) {
          
          res.status(400).send({ error: error })
        } else {
          
          res.send({ message: 'Deleted' })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

module.exports = router