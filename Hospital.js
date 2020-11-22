const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const connectDB = require('./DBConnection')
const common = require('./common')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/Add', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { Name, Phone_No, Address, Location } = req.body
      var requiredFields = ''
      if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Address === undefined || Address === '') {
        requiredFields += 'Address, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Location, '
      } if (requiredFields) {
        
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        const hid = common.getUUIDv4()
        response.all(`INSERT INTO HOSPITAL (ID, Name, Phone_No, Address, Location) VALUES ('${hid}', '${Name}', '${Phone_No}', '${Address}', '${Location}')`, (error, result, fields) => {
          if (error) {
            
            res.status(400).send({ error: error })
          } else {
            
            res.send({ message: 'Hospital Added Successfully', hid: hid })
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
      response.all(`SELECT * FROM HOSPITAL`, (error, result, fields) => {
        if (error) {
          
          res.status(400).send({ error: error })
        } else {
          
          res.send({ hospitals: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetByID/:ID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID } = req.params
      response.all(`SELECT * FROM HOSPITAL WHERE ID = '${ID}'`, (error, result, fields) => {
        if (error) {
          
          res.status(400).send({ error: error })
        } else {
          
          res.send({ hospital: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.post('/Update', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID, Name, Location } = req.body
      var requiredFields = ''
      if (ID === '') {
        requiredFields += 'ID, '
      } if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Location, '
      } if (requiredFields) {
        
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.all(`UPDATE HOSPITAL SET Name = '${Name}', Location = '${Location}' WHERE ID = '${ID}'`, (error, result, fields) => {
          if (error) {
            
            res.status(400).send({ error: error })
          } else {
            
            res.send({ message: 'Hospital Updated Successfully', iid: ID })
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/Delete/:HID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { HID } = req.params
      response.all(`SELECT * FROM ASSIGNED_AMBULANCE_HOSPITAL WHERE HID = '${HID}'`, (error, result, fields) => {
        if (error) {
          
          res.status(400).send({ error: error })
        } else {
          if (result.length > 0) {
            
            res.send({ message: `Can't delete right now because it is assigned to an incident.` })
          } else {
            response.all(`DELETE FROM HOSPITAL WHERE ID = '${HID}'`, (error, result, fields) => {
              if (error) {
                
                res.status(400).send({ error: error })
              } else {
                
                res.send({ message: 'Deleted' })
              }
            })
          }
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

module.exports = router